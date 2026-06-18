/* ============================================
   PARTICLES — Falling Petals & Confetti
   ============================================ */

/**
 * Create falling flower petals effect
 */
function initFallingPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  // Petal SVG paths (jasmine/flower petals)
  const petalSVGs = [
    // Small rounded petal
    `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 0C9 0 14 4 14 9C14 14 9 18 9 18C9 18 4 14 4 9C4 4 9 0 9 0Z" fill="currentColor" opacity="0.7"/>
    </svg>`,
    // Jasmine petal
    `<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="8" cy="10" rx="6" ry="9" fill="currentColor" opacity="0.6"/>
    </svg>`,
    // Small dot
    `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3.5" fill="currentColor" opacity="0.5"/>
    </svg>`,
    // Star shape
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5Z" fill="currentColor" opacity="0.4"/>
    </svg>`
  ];

  const colors = ['#C8A96A', '#D4BC8A', '#E0C98D', '#A8B5A2', '#c4b5a0'];

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const svg = petalSVGs[Math.floor(Math.random() * petalSVGs.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    petal.innerHTML = svg;
    petal.style.color = color;

    // Random positioning
    const left = Math.random() * 100;
    const size = 0.5 + Math.random() * 1;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 5;
    const animType = Math.random() > 0.5 ? 'petal--falling' : 'petal--falling-alt';

    petal.style.cssText += `
      left: ${left}%;
      transform: scale(${size});
      opacity: 0;
    `;
    petal.classList.add(animType);
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    container.appendChild(petal);

    // Remove after animation completes
    setTimeout(() => {
      petal.remove();
    }, (duration + delay) * 1000 + 500);
  }

  // Create initial batch
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createPetal(), i * 400);
  }

  // Create new petals periodically
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      createPetal();
    }
  }, 2500);

  // Initialize fireflies
  function createFirefly() {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';
    
    const size = 2 + Math.random() * 4;
    const left = Math.random() * 100;
    const top = 30 + Math.random() * 70;
    const duration = 15 + Math.random() * 20;
    
    firefly.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: ${top}%;
      width: ${size}px;
      height: ${size}px;
      background-color: #E0C98D;
      border-radius: 50%;
      box-shadow: 0 0 ${size*2}px #C8A96A, 0 0 ${size*4}px #C8A96A;
      opacity: 0;
      animation: fireflyFloat ${duration}s linear infinite forwards,
                 fireflyBlink ${2 + Math.random() * 3}s ease-in-out infinite alternate;
      z-index: var(--z-petals);
      pointer-events: none;
    `;
    
    container.appendChild(firefly);

    setTimeout(() => {
      firefly.remove();
    }, duration * 1000);
  }

  for (let i = 0; i < 20; i++) {
    setTimeout(createFirefly, Math.random() * 5000);
  }

  setInterval(() => {
    if (document.visibilityState === 'visible' && document.querySelectorAll('.firefly').length < 30) {
      createFirefly();
    }
  }, 3000);
}

/**
 * Create confetti burst effect
 */
function createConfetti() {
  const colors = ['#C8A96A', '#D4BC8A', '#E0C98D', '#A8B5A2', '#F8F4EC', '#6B4F3A'];
  const shapes = ['square', 'circle'];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = 6 + Math.random() * 8;
    const left = Math.random() * 100;
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 0.8;

    piece.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${shape === 'circle' ? size : size * 0.6}px;
      background: ${color};
      border-radius: ${shape === 'circle' ? '50%' : '2px'};
      animation: confettiFall ${duration}s ease-in ${delay}s forwards,
                 confettiSway ${duration * 0.5}s ease-in-out ${delay}s infinite;
    `;

    document.body.appendChild(piece);

    // Cleanup
    setTimeout(() => {
      piece.remove();
    }, (duration + delay) * 1000 + 500);
  }
}
