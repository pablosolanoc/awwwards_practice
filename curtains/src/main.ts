import './styles.css';

import gsap from 'gsap';

let sheetContainer: HTMLDivElement | null = null;
const curtainWidth = 14;
let amountOfSheets;

function setupCurtainSheets() {
  sheetContainer = document.querySelector('.curtain');

  sheetContainer!.innerHTML = '';

  const { width, height } = sheetContainer!.getBoundingClientRect();
  const sheetContainerWidth = sheetContainer?.clientWidth ?? 0;

  amountOfSheets = Math.ceil(sheetContainerWidth / curtainWidth);

  sheetContainer!.style.setProperty('--stripe', curtainWidth + 'px');
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
}

function setupAnimation() {
  const sheets = [...(sheetContainer?.children ?? [])];

  sheets?.forEach((element, index) => {
    element.addEventListener('mouseover', () => {
      gsap
        .timeline()
        .to(element, {
          rotationY: -90,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: true,
        })
        .to(element, {
          rotationY: 0,
          duration: 1.8,
          ease: 'elastic.out(1, 0.3)',
        });
    });
  });
}

window.onload = () => {
  setupCurtainSheets();
  setupAnimation();
};

window.addEventListener('resize', () => {
  setupCurtainSheets();
  setupAnimation();
});
