import './style.css';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(CustomEase, SplitText);
  CustomEase.create('hop', '0.8, 0, 0.02, 1');

  const splitText = (
    selector: string,
    type: SplitText.Vars['mask'],
    className: string,
  ) => {
    return SplitText.create(selector, {
      type: type ?? '',
      [`${type}Class`]: className,
      mask: type,
    });
  };

  splitText(
    '.nav-item:not(:nth-child(2)) a, .hero-copy > p, footer p',
    'words',
    'line',
  );

  const counterColumns = document.querySelectorAll('.digit-col');
  counterColumns.forEach((column) => {
    for (let i = 0; i < 10; i++) {
      const digitElement = document.createElement('span');
      digitElement.textContent = i.toString();
      column.appendChild(digitElement);
    }
  });

  const digitHeight = counterColumns[0]
    .querySelector('span')
    ?.getBoundingClientRect().height;

  const animateCounterTo = (value: number) => {
    const tens = Math.floor(value / 10);
    const ones = value % 10;

    gsap.to(counterColumns[0], {
      y: -tens * (digitHeight ?? 0),
      duration: 0.75,
      ease: 'hop',
    });

    gsap.to(counterColumns[1], {
      y: -ones * (digitHeight ?? 0),
      duration: 0.75,
      ease: 'hop',
    });
  };

  gsap.delayedCall(1, () => animateCounterTo(28));
  gsap.delayedCall(1.75, () => animateCounterTo(42));
  gsap.delayedCall(2.5, () => animateCounterTo(68));
  gsap.delayedCall(3.25, () => animateCounterTo(99));

  const marqeeTrack = document.querySelector('.marqee-track');
  const marqeeItemWidth = marqeeTrack?.querySelector('h1')?.offsetWidth;

  console.log({
    marqeeTrack,
    marqeeItemWidth,
  });

  gsap.to(marqeeTrack, {
    x: -(marqeeItemWidth ?? 0),
    duration: 7.5,
    ease: 'none',
    repeat: -1,
  });

  const tl = gsap.timeline({ delay: 0.5 });

  document.querySelectorAll('.hero-img').forEach((heroImage, index) => {
    const startTime = index * 0.5;

    tl.to(
      heroImage,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.5,
        ease: 'hop',
      },
      startTime,
    );

    tl.to(
      heroImage.querySelector('img'),
      {
        scale: 1,
        duration: 1.5,
        ease: 'hop',
      },
      startTime,
    );
  });

  tl.to('.hero-overlay', {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    duration: 1,
    ease: 'hop',
  });

  tl.to(
    '.hero-img-wrapper',
    {
      transform: 'translate(-50%, -75%)',
      duration: 1,
      ease: 'hop',
    },
    '<',
  );

  const revealProps = {
    y: '0%',
    duration: 1,
    ease: 'power4.out',
  };

  tl.to('.marqee-track h1', { ...revealProps }, '<0.65');
  tl.to('nav .line, nav img', { ...revealProps, stagger: 0.1 }, '<0.125');
  tl.to('.hero-copy > p .line', { ...revealProps, stagger: 0.1 }, '<0.125');
  tl.to('.hero-callout p', { ...revealProps, opacity: 1 }, '<0.125');
  tl.to('footer .line', { ...revealProps }, '<0.125');
});
