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

const pin = () => parseFloat(getComputedStyle(cards[0]).height);

// How far the incoming card swings left, as a % of its own width.
const SLIDE_OUT = -100;

const outro = document.getElementsByClassName('outro');

cards.forEach((card, i) => {
  const depth = cards.length - 1 - i;

  // Two bands, so a card can arrive on top yet land at the back: it enters at
  // `front` (above every card already stacked) and the swing drops it to
  // `back` (below all of them). Every value stays >= 0 -- a negative z-index
  // would paint the card behind its ancestors' backgrounds.
  const front = cards.length + i;
  const back = depth;

  card.style.zIndex = `${front}`;

  console.log(`top ${pin()}ss`);

  const st = {
    trigger: card,
    endTrigger: cards.at(-1),
    start: () => `top ${pin()}px`,
    end: () => `top ${pin()}px`,
    scrub: true,
    invalidateOnRefresh: true,
    markers: true,
  };

  console.log(i === cards.length - 1 ? outro[0] : cards.at(i + 1));

  const st2 = {
    trigger: card,
    endTrigger: i === cards.length - 1 ? outro[0] : cards.at(i + 1),
    start: () => `top ${pin()}px`,
    end: () => `top ${pin()}px`,
    scrub: true,
    invalidateOnRefresh: true,
    markers: true,
    // Deal the card to the back at the apex of the swing, while it is clear of
    // the stack. Driven off progress rather than tweened: z-index has no
    // meaningful in-between values, and a pure function of progress flips back
    // on its own when you scrub up. 0.5 is the apex -- both legs below are the
    // same length.
    onUpdate: (self: ScrollTrigger) => {
      card.style.zIndex = `${self.progress > 0.5 ? back : front}`;
    },
  };

  gsap.to(card, {
    scale: 1 + 0.01 * depth,
    y: 10 * depth,
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
    .to(card, { xPercent: 0, ease: 'power1.in' });

  // gsap.to(card.querySelector('.spotlight-face'), {
  //   opacity: 0,
  //   ease: 'none',
  //   scrollTrigger: { ...st },
  // });
});
