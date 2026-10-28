// The story is a short film. It plays once when the envelope opens (scroll stays locked until it ends),
// with Skip and replay. Sound is always on. The end buttons (scroll cue, replay) appear only when the film
// has finished or been skipped. If the browser refuses to autoplay (iOS Low Power Mode), a Play button shows instead.
export function initStory() {
  const stage = document.getElementById('story-stage');
  const video = document.getElementById('story-video');
  const skipBtn = document.getElementById('story-skip');
  const bar = stage.querySelector('.story-bar');
  const barFill = bar.firstElementChild;
  const end = stage.querySelector('.story-end');
  const playBtn = document.getElementById('story-play');
  let onDone = null, finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    playBtn.hidden = true;
    stage.classList.add('is-done');
    skipBtn.hidden = true; bar.hidden = true; end.hidden = false;
    onDone?.();
  };
  const start = async () => {
    playBtn.hidden = true;
    try { video.muted = false; await video.play(); }
    catch { if (!finished) playBtn.hidden = false; }
  };
  // When the film ends on its own, glide on to the next section (scroll is unlocked by onDone first).
  const goOn = () => setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 700);

  video.addEventListener('ended', () => { finish(); goOn(); });
  video.addEventListener('error', finish);
  video.addEventListener('timeupdate', () => { barFill.style.width = `${(video.currentTime / (video.duration || 1)) * 100}%`; });
  video.addEventListener('click', () => { if (!finished) (video.paused ? video.play() : video.pause()); });
  playBtn.addEventListener('click', start);
  skipBtn.addEventListener('click', () => { video.pause(); finish(); });
  document.getElementById('story-replay').addEventListener('click', () => {
    finished = false; stage.classList.remove('is-done');
    end.hidden = true; skipBtn.hidden = false; bar.hidden = false;
    document.documentElement.classList.add('is-locked');
    document.getElementById('story').scrollIntoView({ behavior: 'instant' });
    video.currentTime = 0;
    start();
  });

  return {
    // Called inside the seal tap: iOS only lets a video start if play() runs from a user gesture,
    // and the film itself starts a couple of seconds later, so unlock the element here. Muted, so
    // nothing is heard behind the envelope; start() turns the sound on when the film really begins.
    prime() {
      video.muted = true;
      const unlock = video.play();
      if (unlock) unlock.then(() => { video.pause(); video.currentTime = 0; }).catch(() => {});
    },
    play(done) { onDone = done; start(); },
    skip(done) { onDone = done; video.pause(); finish(); },
  };
}
