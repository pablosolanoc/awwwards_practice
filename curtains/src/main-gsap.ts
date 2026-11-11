import './styles2.css';

const KICK = 20;

const curtainWidth = 24;

let sheetContainer: HTMLDivElement | null = null;
let turn: Float32Array<ArrayBuffer>;
let turnV: Float32Array<ArrayBuffer>;
let running = false;
let last: { x: number; t: number } | null = null;

let sheets: HTMLDivElement[] = [];

let amountOfSheets = 0;

const DAMPING = 0.945;
const MAX_TURN = 85;
const SPRING = 0.01;

function setupCurtainSheets() {
  sheetContainer = document.querySelector('.curtain');

  const { width, height } = sheetContainer!.getBoundingClientRect();
  const sheetContainerWidth = sheetContainer?.clientWidth ?? 0;

  amountOfSheets = Math.ceil(sheetContainerWidth / curtainWidth);

  console.log({
    sheetContainer,
    sheetContainerWidth,
    amountOfSheets,
    width,
    height,
  });

  sheetContainer!.style.setProperty('--w', width + 'px');
  sheetContainer!.style.setProperty('--h', height + 'px');

  for (let i = 0; i < amountOfSheets; i++) {
    const zIndex = amountOfSheets - i;

    const newSheet = document.createElement('div');
    newSheet.className = 'sheet';
    newSheet.style.zIndex = `${zIndex}`;
    newSheet.style.setProperty('--x', -(i * curtainWidth) + 'px');

    sheetContainer?.appendChild(newSheet);
  }

  if (sheetContainer?.children) {
    sheets = [...sheetContainer?.children];
  }

  turn = new Float32Array(amountOfSheets);
  turnV = new Float32Array(amountOfSheets);
}

setupCurtainSheets();

function onPointerMove(event: PointerEvent) {
  const now = performance.now();

  if (last) {
    const leftOfContainer = sheetContainer!.getBoundingClientRect().left;

    const x0 = last.x - leftOfContainer;
    const x1 = event.clientX - leftOfContainer;

    const from = Math.floor(x0 / curtainWidth);
    const to = Math.floor(x1 / curtainWidth);

    console.log({ clientX: event.clientX, leftOfContainer });

    if (from !== to) {
      const dir = Math.sign(x1 - x0);
      const dt = Math.max(now - last.t, 8);

      const speed = Math.min(Math.abs(x1 - x0) / dt, 3) / 3;

      const strength = 0.25 + 0.75 * speed;

      for (let i = from + dir; i !== to + dir; i += dir) {
        if (i >= 0 && i < amountOfSheets) {
          turnV[i] += dir * KICK * strength;
        }
        start();
      }
    }
  }
  last = { x: event.clientX, t: now };
}

function tick() {
  for (let i = 0; i < amountOfSheets; i++) {
    turnV[i] = (turnV[i] - SPRING * turn[i]) * DAMPING;
    turn[i] = Math.max(-MAX_TURN, Math.min(MAX_TURN, turn[i] + turnV[i]));
  }
}

function reset(el: HTMLDivElement) {
  el.style.transform = '';
  el.style.removeProperty('--shade');
}

let TICK = 1000 / 60;
let prevFrame = 0;
let acc = 0;

function step(now: DOMHighResTimeStamp) {
  acc += Math.min(now - (prevFrame || now - TICK), 100);
  prevFrame = now;
  while (acc >= TICK) {
    tick();
    acc -= TICK;
  }

  let maxMotion = 0;
  for (let i = 0; i < amountOfSheets; i++) {
    const m = Math.abs(turn[i]) + Math.abs(turnV[i]);
    maxMotion = Math.max(maxMotion, m);
    const el = sheets[i];
    if (m < 0.05) {
      if (el.style.transform) {
        reset(el);
      }
      continue;
    }
    el.style.transform = `rotateY(${turn[i].toFixed(2)}deg)`;
    el.style.setProperty(
      '--shade',
      (Math.abs(Math.sin((turn[i] * Math.PI) / 180)) * 0.7).toFixed(3),
    );
  }

  if (maxMotion > 0.3) {
    requestAnimationFrame(step);
  } else {
    running = false;
    prevFrame = 0;
    acc = 0;
    turn.fill(0);
    turnV.fill(0);
    sheets.forEach(reset);
  }
}

function start() {
  if (!running) {
    running = true;
    requestAnimationFrame(step);
  }
}

sheetContainer!.addEventListener('pointermove', onPointerMove);
sheetContainer!.addEventListener('pointerleave', () => {
  last = null;
});
