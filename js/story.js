export function initStory(reduced) {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger || reduced) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('[data-scene]').forEach(scene => {
    const media = scene.querySelector('.scene__frame img, .collage');
    const text = scene.querySelector('.scene__text');
    const frame = scene.querySelector('.scene__frame, .collage');
    const tl = gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    if (frame) tl.fromTo(frame, { opacity: 0, scale: 0.88, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.1)
                 .to(frame, { opacity: 0, scale: 1.04, y: -40, duration: 0.2 }, 0.8);
    if (media && media.tagName === 'IMG') tl.fromTo(media, { scale: 1.18 }, { scale: 1, duration: 0.6, ease: 'none' }, 0.1);
    if (text) tl.fromTo(text, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.22)
                .to(text, { opacity: 0, y: -40, duration: 0.18 }, 0.8);
  });
}
