export function initEnvelope(onOpen) {
  const env = document.getElementById('envelope');
  const seal = document.getElementById('seal');
  let opened = false;
  const open = () => {
    if (opened) return;
    opened = true;
    env.classList.add('open');
    setTimeout(() => { env.classList.add('gone'); onOpen(); }, 2300);
  };
  seal.addEventListener('click', open);
  env.addEventListener('click', open);
}
