import './style.css';
import gsap from 'gsap';

const imagesRoutes = [
  'https://plus.unsplash.com/premium_photo-1792943532153-d68e34e9c1bb?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'https://plus.unsplash.com/premium_photo-1792677480193-04a59e9d5711?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'https://images.unsplash.com/photo-1793363562541-f27fa7e52688?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'https://images.unsplash.com/photo-1792065290743-bcc0135d4d79?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'https://images.unsplash.com/photo-1793514260914-ab9b48bb2704?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'https://images.unsplash.com/photo-1793782014112-66947fd47f8e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
];

const config = {
  imageCount: imagesRoutes.length,
  visibleSlidesRight: 12,
  visibleSlidesLeft: 2,
  offsetStep: 10,
  rotationStep: -7,
  scaleStep: 0.05,
  blurStep: 0.95,
  brightnessStep: 0.1,
  minBrightness: 0.25,
  wheelSensitivity: 0.005,
  touchSensitivity: 0.0075,
  maxWheelDelta: 200,
  smoothing: 0.075,
  snapDelay: 250,
  swapThreshold: 0.5,
};

const slideCount = config.visibleSlidesLeft + config.visibleSlidesRight + 2;

const slider = document.querySelector('.slider');
const slidesContainer = document.querySelector('.slides');

for (let i = 0; i < slideCount; i++) {
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.innerHTML = `
    <div class="slide-img">
      <img alt=""/>
    </div>
  `;
  slidesContainer?.appendChild(slide);
}

const slides = document.querySelectorAll('.slide');

let currentPosition = 0;
let targetPosition = 0;
let scrollDirection = 1;

const wrapOffset = gsap.utils.wrap(
  -(config.visibleSlidesLeft + 1),
  slideCount - (config.visibleSlidesLeft + 1),
);

const wrapImageIndex = gsap.utils.wrap(0, config.imageCount);

function updateSlideImage(slide, position: number) {
  const imageIndex = wrapImageIndex(Math.round(position));

  if (slide.dataset.image === String(imageIndex)) return;

  slide.dataset.image = imageIndex;
  slide.querySelector('img').src = `${imagesRoutes[imageIndex]}`;
}

function getSlideZIndex(offset: number) {
  const travelOffset = offset * scrollDirection;

  if (travelOffset >= 0) {
    return Math.round(1000 - travelOffset * 10);
  }

  if (travelOffset > -config.swapThreshold) {
    return 1001;
  }

  return Math.round(500 + travelOffset * 10);
}

function getSlideOpacity(offset: number) {
  const opacity =
    offset < 0
      ? config.visibleSlidesLeft + 1 + offset
      : config.visibleSlidesRight + 1 - offset;

  return opacity;
}

function renderSlides() {
  slides.forEach((slide: Element, index) => {
    const offset = wrapOffset(index - currentPosition);
    console.log({ offset });
    const distance = Math.abs(offset);

    const blur = distance * config.blurStep;
    const brightness = Math.max(
      config.minBrightness,
      1 - distance * config.brightnessStep,
    );

    updateSlideImage(slide, currentPosition + offset);

    gsap.set(slide, {
      xPercent: offset * config.offsetStep,
      rotation: offset * config.rotationStep,
      scale: 1 - distance * config.scaleStep,
      filter: `blur(${blur}px) brightness(${brightness})`,
      opacity: getSlideOpacity(offset),
      zIndex: getSlideZIndex(offset),
    });
  });
}

renderSlides();

let snapTimeout: number;

function snapToSlide() {
  const outgoingPosition =
    scrollDirection > 0
      ? Math.floor(targetPosition)
      : Math.ceil(targetPosition);

  const distanceMoved = Math.abs(targetPosition - outgoingPosition);

  targetPosition =
    distanceMoved < config.swapThreshold
      ? outgoingPosition
      : outgoingPosition * scrollDirection;
}

function moveSlider(amount: number) {
  if (amount === 0) return;

  scrollDirection = Math.sign(amount);
  targetPosition += amount;

  clearTimeout(snapTimeout);
  snapTimeout = setTimeout(snapToSlide, config.snapDelay);
}

slider?.addEventListener(
  'wheel',
  (event: WheelEvent) => {
    event.preventDefault();

    const delta = gsap.utils.clamp(
      -config.maxWheelDelta,
      config.maxWheelDelta,
      event.deltaY,
    );

    moveSlider(delta * config.wheelSensitivity);
  },
  {
    passive: false,
  },
);

let lastTouchY = 0;

slider?.addEventListener('touchStart', (event: TouchEvent) => {
  lastTouchY = event.touches[0].clientY;
});

slider?.addEventListener('touchmove', (event: TouchEvent) => {
  const touchY = event.touches[0].clientY;
  moveSlider((lastTouchY - touchY) * config.touchSensitivity);
  lastTouchY = touchY;
});

gsap.ticker.add(() => {
  if (currentPosition === targetPosition) return;

  currentPosition += (targetPosition - currentPosition) * config.smoothing;

  if (Math.abs(targetPosition - currentPosition) < 0.001) {
    currentPosition = targetPosition;
  }

  console.log({ currentPosition, targetPosition });

  console.log('hey');

  renderSlides();
});
