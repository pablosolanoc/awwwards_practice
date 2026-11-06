import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const cards: HTMLDivElement[] = gsap.utils.toArray('.spotlight-card');

const pin = () => getComputedStyle(cards[0]).top;

// How far the incoming card swings left, as a % of its own width.
const SLIDE_OUT = -100;

const outro = document.getElementsByClassName('outro');

cards.forEach((card, i) => {
  const depth = cards.length - 1 - i;

  card.style.zIndex = `${i}`;

  console.log(`top ${pin()}`);

  const st = {
    trigger: card,
    endTrigger: cards.at(-1),
    start: () => `top ${pin()}`,
    end: () => `top ${pin()}`,
    scrub: true,
    invalidateOnRefresh: true,
    // markers: true,
  };

  console.log(i === cards.length - 1 ? outro[0] : cards.at(i + 1));

  const st2 = {
    trigger: card,
    endTrigger: i === cards.length - 1 ? outro[0] : cards.at(i + 1),
    start: () => `top ${pin()}`,
    end: () => `top ${pin()}`,
    scrub: true,
    invalidateOnRefresh: true,
    markers: true,
    // While it swings out, paint above the card before it. Matching that card's
    // z-index is enough to win: equal z-index falls back to DOM order.
    // onToggle: (self: ScrollTrigger) => {
    //   card.style.zIndex = `${self.isActive ? depth + 1 : depth}`;
    // },
  };

  gsap.to(card, {
    scale: 1 - 0.1 * depth,
    y: -20 * depth,
    ease: 'none',
    scrollTrigger: { ...st },
  });

  gsap
    .timeline({ scrollTrigger: { ...st2 } })
    // fromTo pins the starting value so an invalidateOnRefresh mid-window
    // cannot re-record it from wherever the card happens to be sitting.
    .fromTo(
      card,
      { xPercent: 0 },
      {
        xPercent: i === 0 ? 0 : SLIDE_OUT,
        ease: 'power1.out',
      },
    )
    .to(card, { xPercent: 0, ease: 'power1.in', zIndex: `${depth}` });

  // gsap.to(card.querySelector('.spotlight-face'), {
  //   opacity: 0,
  //   ease: 'none',
  //   scrollTrigger: { ...st },
  // });
});
