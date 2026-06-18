/* ============================================
   RSVP — Form Handling
   ============================================ */

const STORAGE_KEY = 'wedding_rsvp_wishes';

/**
 * Initialize RSVP form
 */
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  // Load existing wishes
  renderWishes();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      nama: formData.get('nama')?.trim(),
      kehadiran: formData.get('kehadiran'),
      jumlah: formData.get('jumlah'),
      ucapan: formData.get('ucapan')?.trim(),
      timestamp: new Date().toISOString()
    };

    // Validation
    if (!data.nama) {
      showToast('Mohon isi nama Anda');
      return;
    }
    if (!data.kehadiran) {
      showToast('Mohon pilih konfirmasi kehadiran');
      return;
    }
    if (!data.ucapan) {
      showToast('Mohon tulis ucapan Anda');
      return;
    }

    // Save to localStorage
    saveWish(data);

    // Show success
    showToast('Terima kasih! Ucapan Anda telah terkirim ✨');

    // Reset form
    form.reset();

    // Re-render wishes
    renderWishes();
  });
}

/**
 * Save wish to localStorage
 */
function saveWish(data) {
  const wishes = getWishes();
  wishes.unshift(data);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Get wishes from localStorage
 */
function getWishes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Render wishes list
 */
function renderWishes() {
  const container = document.getElementById('wishes-list');
  if (!container) return;

  const wishes = getWishes();

  if (wishes.length === 0) {
    container.innerHTML = `
      <div class="wish-card" style="text-align: center; opacity: 0.5;">
        <p class="wish-card__message">Belum ada ucapan. Jadilah yang pertama! 💌</p>
      </div>
    `;
    return;
  }

  container.innerHTML = wishes.map(wish => `
    <div class="wish-card">
      <p class="wish-card__name">${escapeHtml(wish.nama)}</p>
      <p class="wish-card__message">${escapeHtml(wish.ucapan)}</p>
      <p class="wish-card__date">${formatTimestamp(wish.timestamp)}</p>
    </div>
  `).join('');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format timestamp to readable date
 */
function formatTimestamp(ts) {
  try {
    const date = new Date(ts);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', options);
  } catch {
    return '';
  }
}
