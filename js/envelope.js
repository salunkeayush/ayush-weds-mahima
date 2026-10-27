export function initEnvelope(onTap, onOpen) {
  const env = document.getElementById('envelope');
  const seal = document.getElementById('seal');
  let opened = false;
  const open = () => {
    if (opened) return;
    opened = true;
    onTap?.();
    env.classList.add('open');
    setTimeout(() => env.classList.add('out'), 2400);
    setTimeout(() => { env.classList.add('gone'); onOpen(); }, 3100);
  };
  seal.addEventListener('click', open);
  env.addEventListener('click', open);
}
