// "Living paintings": a WebGL shader that moves a still painting.
// mask.R = wind (hair, cloth, leaves, mist sway), mask.G = glow (lights twinkle), mask.B = depth (parallax).
export function sceneIndexAt(starts, t) {
  let k = 0;
  for (let i = 0; i < starts.length; i++) if (starts[i] <= t) k = i;
  return k;
}

const VS = `attribute vec2 p; varying vec2 uv;
void main(){ uv = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }`;

const FS = `precision mediump float;
varying vec2 uv; uniform sampler2D img, mask; uniform float t, zoom; uniform vec2 cam;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec4 m = texture2D(mask, uv);
  vec2 c = (uv - .5) / zoom + .5 + cam * .006;
  vec2 wind = vec2(sin(c.y * 21. + t * 2.1) + .6 * sin(c.y * 46. - t * 3.2) + .4 * sin(c.x * 12. + t * 1.3),
                   .5 * sin(c.x * 17. + t * 1.7)) * .0075 * m.r;
  vec2 par = cam * (m.b - .3) * .02;
  vec3 col = texture2D(img, clamp(c + wind + par, .002, .998)).rgb;
  float tw = .6 + .4 * sin(t * 1.9 + uv.x * 38. + uv.y * 23. + h(floor(uv * vec2(14., 8.))) * 3.);
  col += m.g * tw * vec3(.32, .21, .08);
  gl_FragColor = vec4(col, 1.);
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
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
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

  const tex = (unit, image) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
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

  const frame = now => {
    raf = requestAnimationFrame(frame);
    if (!current || !canvas.parentElement) return;
    resize();
    const t = now / 1000;
    const sc = scenes.get(current);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sc.img);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, sc.mask);
    gl.uniform1f(U('t'), t);
    gl.uniform1f(U('zoom'), 1.03 + 0.09 * progress);
    gl.uniform2f(U('cam'), Math.sin(t * 0.45) , Math.cos(t * 0.31) * 0.6);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  return {
    canvas,
    async load(id, imgUrl, maskUrl) {
      const [im, mk] = await Promise.all([loadImg(imgUrl), loadImg(maskUrl)]);
      scenes.set(id, { img: tex(0, im), mask: tex(1, mk) });
    },
    has: id => scenes.has(id),
    attach(id, host) {
      current = id;
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
