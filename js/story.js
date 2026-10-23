// The story is a short film. It plays once when the envelope opens (scroll stays locked until it ends),
// with Skip, sound, full screen and replay. Reduced-motion guests get native controls and no autoplay.
export function initStory(reduced) {
  const stage = document.getElementById('story-stage');
  const video = document.getElementById('story-video');
  const skipBtn = document.getElementById('story-skip');
  const soundBtn = document.getElementById('story-sound');
  const fsBtn = document.getElementById('story-fs');
  const bar = stage.querySelector('.story-bar');
  const barFill = bar.firstElementChild;
  const end = stage.querySelector('.story-end');
  let onDone = null, finished = false, watchdog = 0;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(watchdog);
    stage.classList.add('is-done');
    skipBtn.hidden = true; bar.hidden = true; end.hidden = false;
    onDone?.();
  };
  const soundLabel = () => {
    soundBtn.textContent = video.muted ? 'Sound on' : 'Sound off';
    soundBtn.setAttribute('aria-pressed', String(!video.muted));
  };
  const start = async () => {
    try { video.muted = false; await video.play(); }
    catch { try { video.muted = true; await video.play(); } catch { finish(); return; } }
    soundLabel();
    watchdog = setTimeout(() => { if (video.currentTime < 0.2) finish(); }, 8000);
  };

  video.addEventListener('ended', finish);
  video.addEventListener('error', finish);
  video.addEventListener('timeupdate', () => { barFill.style.width = `${(video.currentTime / (video.duration || 1)) * 100}%`; });
  video.addEventListener('click', () => { if (!finished) (video.paused ? video.play() : video.pause()); });
  skipBtn.addEventListener('click', () => { video.pause(); finish(); });
  soundBtn.addEventListener('click', () => { video.muted = !video.muted; soundLabel(); });
  fsBtn.addEventListener('click', () => {
    const go = stage.requestFullscreen || stage.webkitRequestFullscreen;
    if (go) go.call(stage); else video.webkitEnterFullscreen?.();
  });
  document.getElementById('story-replay').addEventListener('click', () => {
    finished = false; stage.classList.remove('is-done');
    end.hidden = true; skipBtn.hidden = false; bar.hidden = false;
    document.documentElement.classList.add('is-locked');
    document.getElementById('story').scrollIntoView({ behavior: 'instant' });
    video.currentTime = 0;
    start();
  });
  soundLabel();

  return {
    play(done) {
      onDone = done;
      if (reduced) { video.controls = true; finish(); return; }
      start();
    },
    skip(done) { onDone = done; video.pause(); finish(); },
  };
}
