// "Living paintings": a WebGL compositor that moves a painted still and the people cut out of it.
// mask.R = wind (hair, cloth, leaves sway), mask.G = glow (lights twinkle), mask.B = depth (parallax).
// A scene is drawn as: plate (background) + layers (people / windows), each with its own animated
// transform { x, y (fractions of the card), s (scale), r (degrees), a (opacity) } that GSAP tweens.
export function sceneIndexAt(starts, t) {
  let k = 0;
  for (let i = 0; i < starts.length; i++) if (starts[i] <= t) k = i;
  return k;
}

export function makeLayerState(scene) {
  const neutral = () => ({ x: 0, y: 0, s: 1, r: 0, a: 1 });
  if (!scene.live) return {};
  const out = { plate: neutral() };
  for (const l of scene.live.layers || []) out[l.id] = neutral();
  return out;
}

const VS = `attribute vec2 p; varying vec2 uv;
void main(){ uv = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }`;

const FS = `precision mediump float;
varying vec2 uv; uniform sampler2D img, mask;
uniform float t, zoom, aspect, scale, rot, alpha, depth, isLayer;
uniform vec2 cam, off, pivot;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 c = (uv - .5) / zoom + .5 + cam * .006;
  vec2 q = c - pivot - off;
  q.x *= aspect;
  float cs = cos(-rot), sn = sin(-rot);
  q = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y) / scale;
  q.x /= aspect;
  c = q + pivot + cam * (depth - .3) * .012 * isLayer;
  vec4 m = texture2D(mask, clamp(c, 0., 1.));
  vec2 wind = vec2(sin(c.y * 21. + t * 2.1) + .6 * sin(c.y * 46. - t * 3.2) + .4 * sin(c.x * 12. + t * 1.3),
                   .5 * sin(c.x * 17. + t * 1.7)) * .0075 * m.r;
  vec2 par = cam * (m.b - .3) * .02 * (1. - isLayer);
  vec2 sp = c + wind + par;
  vec4 col = texture2D(img, clamp(sp, .002, .998));
  float inb = step(0., c.x) * step(c.x, 1.) * step(0., c.y) * step(c.y, 1.);
  float a = mix(1., col.a * inb, isLayer) * alpha;
  float tw = .6 + .4 * sin(t * 1.9 + c.x * 38. + c.y * 23. + h(floor(c * vec2(14., 8.))) * 3.);
  vec3 rgb = (col.rgb + m.g * tw * vec3(.32, .21, .08) * col.a) * alpha * mix(1., inb, isLayer);
  gl_FragColor = vec4(rgb, a);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

const loadImg = src => new Promise((res, rej) => {
  const i = new Image();
  i.onload = () => res(i);
  i.onerror = () => rej(new Error(`image ${src}`));
  i.src = src;
});

// Returns null when WebGL is unavailable (callers keep the static image).
export function createLive() {
  const canvas = document.createElement('canvas');
  canvas.className = 'live-canvas';
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: true });
  if (!gl) return null;
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
  } catch { return null; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  gl.uniform1i(U('img'), 0); gl.uniform1i(U('mask'), 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const tex = (unit, image, premultiply) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    return t;
  };

  const scenes = new Map();
  let current = null, raf = 0, progress = 0, running = false;

  const resize = () => {
    const host = canvas.parentElement;
    if (!host) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(2, Math.round(host.clientWidth * dpr)), h = Math.max(2, Math.round(host.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  };

  const draw = (texImg, st, isLayer, pivot, depth, zoom, t, aspect) => {
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texImg);
    gl.uniform1f(U('isLayer'), isLayer);
    gl.uniform2f(U('off'), st.x, st.y);
    gl.uniform1f(U('scale'), Math.max(0.01, st.s));
    gl.uniform1f(U('rot'), (st.r * Math.PI) / 180);
    gl.uniform1f(U('alpha'), st.a);
    gl.uniform2f(U('pivot'), pivot[0], pivot[1]);
    gl.uniform1f(U('depth'), depth);
    gl.uniform1f(U('zoom'), zoom);
    gl.uniform1f(U('t'), t);
    gl.uniform1f(U('aspect'), aspect);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const frame = now => {
    raf = requestAnimationFrame(frame);
    if (!current || !canvas.parentElement) return;
    resize();
    const t = now / 1000, sc = scenes.get(current);
    const aspect = canvas.width / canvas.height;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, sc.mask);
    gl.uniform2f(U('cam'), Math.sin(t * 0.45), Math.cos(t * 0.31) * 0.6);
    const zoom = 1.03 + 0.09 * progress;
    gl.disable(gl.BLEND);
    draw(sc.plate, sc.states.plate || { x: 0, y: 0, s: 1, r: 0, a: 1 }, 0, [0.5, 0.5], 0.3, zoom, t, aspect);
    gl.enable(gl.BLEND);
    for (const l of sc.layers) draw(l.tex, sc.states[l.id], 1, l.pivot, l.depth, zoom, t, aspect);
  };

  return {
    canvas,
    // cfg = { img, mask, plate?, layers?: [{ id, url, pivot, depth }] }
    async load(id, cfg) {
      const [im, mk, pl, ...lys] = await Promise.all([
        loadImg(cfg.img), loadImg(cfg.mask), loadImg(cfg.plate || cfg.img), ...(cfg.layers || []).map(l => loadImg(l.url)),
      ]);
      scenes.set(id, {
        plate: tex(0, pl, false), mask: tex(1, mk, false), states: {},
        layers: (cfg.layers || []).map((l, i) => ({ id: l.id, pivot: l.pivot || [0.5, 1], depth: l.depth ?? 0.6, tex: tex(0, lys[i], true) })),
      });
      void im;
    },
    has: id => scenes.has(id),
    attach(id, host, states = {}) {
      current = id;
      scenes.get(id).states = states;
      document.querySelectorAll('.cardbox.is-live').forEach(el => el.classList.remove('is-live'));
      host.append(canvas);
      host.closest('.cardbox')?.classList.add('is-live');
      resize();
    },
    setProgress(p) { progress = Math.min(1, Math.max(0, p)); },
    start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } },
    stop() { running = false; cancelAnimationFrame(raf); },
  };
}
