/* ============================================
   ANIMATIONS — Scroll Reveal & Parallax
   ============================================ */

/**
 * Initialize scroll-triggered reveal animations
 */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stagger children if present
        const children = entry.target.querySelectorAll('[data-reveal-child]');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1 + 0.15}s`;
          child.classList.add('revealed');
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/**
 * Initialize parallax effect on hero background
 */
function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight * 1.5) {
      const translateY = scrollY * 0.3;
      const scale = 1.1 + scrollY * 0.0002;
      heroBg.style.transform = `translateY(${translateY}px) scale(${scale})`;
    }
  }, 16);

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Add smooth section transitions with fade
 */
function initSectionTransitions() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section--visible');
      }
    });
  }, {
    threshold: 0.05
  });

  sections.forEach(section => observer.observe(section));
}
