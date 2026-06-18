/* ============================================
   COUNTDOWN — Timer Logic
   ============================================ */

/**
 * Initialize countdown timer
 * @param {string} targetDate - Target date string (ISO format)
 * @param {string} containerId - Container element ID
 */
function initCountdown(targetDate, containerId = 'countdown') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const target = new Date(targetDate).getTime();

  const elements = {
    days: container.querySelector('[data-countdown="days"]'),
    hours: container.querySelector('[data-countdown="hours"]'),
    minutes: container.querySelector('[data-countdown="minutes"]'),
    seconds: container.querySelector('[data-countdown="seconds"]')
  };

  // Store previous values for flip animation
  const prevValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };

  function update() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      // Wedding day has arrived!
      Object.values(elements).forEach(el => {
        if (el) el.textContent = '0';
      });
      const message = container.querySelector('.countdown__message');
      if (message) {
        message.textContent = '🎉 Hari Bahagia Telah Tiba! 🎉';
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Update with flip animation
    updateDigit(elements.days, days, 'days', prevValues);
    updateDigit(elements.hours, hours, 'hours', prevValues);
    updateDigit(elements.minutes, minutes, 'minutes', prevValues);
    updateDigit(elements.seconds, seconds, 'seconds', prevValues);
  }

  function updateDigit(el, value, key, prev) {
    if (!el) return;
    const padded = String(value).padStart(2, '0');
    if (prev[key] !== value) {
      el.textContent = padded;
      el.classList.add('flip');
      setTimeout(() => el.classList.remove('flip'), 500);
      prev[key] = value;
    }
  }

  update();
  setInterval(update, 1000);
}
