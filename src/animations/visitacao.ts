import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateVisitacao(): void {
  const section = document.querySelector(".visitacao-cta");
  const eyebrow = document.querySelector(".visitacao__eyebrow");
  const title = document.querySelector(".visitacao__title");
  const infoBox = document.querySelector(".visitacao__info-box");
  const buttonReveal = document.querySelector(".visitacao__reveal:last-child");
  const decors = document.querySelectorAll(".visitacao__decor");

  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  });

  // 1. Reveal eyebrow and title
  tl.to([eyebrow, title], {
    opacity: 1,
    y: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out",
  });

  // 2. Info Box entrance
  tl.to(
    infoBox,
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "back.out(1.2)",
    },
    "-=0.6",
  );

  // 3. Button reveal
  tl.to(
    buttonReveal,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=0.4",
  );

  // 4. Parallax and Floating for Decors
  decors.forEach((decor, i) => {
    // Entrance
    gsap.fromTo(
      decor,
      { opacity: 0, scale: 0, rotation: -45 },
      {
        opacity: i === 1 ? 0.15 : 0.2,
        scale: 1,
        rotation: 0,
        duration: 2,
        delay: 0.5 + i * 0.2,
        ease: "elastic.out(1, 0.3)",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      },
    );

    // Parallax scrub
    gsap.to(decor, {
      y: (i + 1) * -80,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
