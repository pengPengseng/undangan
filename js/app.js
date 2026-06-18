/* ============================================
   APP — Main Entry Point
   ============================================ */

/* ── Configuration ── */
const CONFIG = {
  weddingDate: '2025-12-20T08:00:00+07:00', // Tanggal pernikahan
  groomName: 'Rama',
  brideName: 'Shinta',
};

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  // Check for guest name in URL
  const guestName = getQueryParam('to');
  if (guestName) {
    const guestEl = document.getElementById('guest-name');
    if (guestEl) {
      guestEl.textContent = `Kepada Yth. ${decodeURIComponent(guestName)}`;
    }
  }

  // Initialize music player (returns controller)
  const musicController = initMusicPlayer();

  // Cover / Opening overlay
  initCover(musicController);

  // Copy buttons for gift section
  initCopyButtons();

  // Share button
  initShareButton();
});

/**
 * Initialize cover overlay
 */
function initCover(musicController) {
  const cover = document.getElementById('cover');
  const mainContent = document.getElementById('main-content');
  const openBtn = document.getElementById('open-invitation');

  if (!cover || !openBtn) return;

  openBtn.addEventListener('click', () => {
    // 1. Mulai animasi teatrikal pembuka (Wayang & Gunungan)
    cover.classList.add('is-opening');
    
    // Putar musik saat animasi dimulai
    if (musicController) {
      musicController.startMusic();
    }

    // 2. Setelah Gunungan maju ke tengah, tarik ke atas (seperti mulai pertunjukan Wayang)
    setTimeout(() => {
      cover.classList.add('is-lifting');
      document.body.classList.remove('no-scroll');
      
      // Tampilkan konten utama di bawahnya
      if (mainContent) {
        mainContent.style.display = 'block';
        void mainContent.offsetHeight;
      }
      
      // Ledakan Confetti saat Gunungan terangkat
      createConfetti();
    }, 1200);

    // 3. Inisialisasi fitur-fitur halaman
    setTimeout(() => {
      initRevealAnimations();
      initParallax();
      initSectionTransitions();
      initCountdown(CONFIG.weddingDate);
      initGallery();
      initRSVP();
      initFallingPetals();
      initLazyLoad();
    }, 1500);

    // 4. Bersihkan DOM setelah animasi selesai
    setTimeout(() => {
      cover.remove();
    }, 3500);
  });
}

/**
 * Initialize copy-to-clipboard buttons
 */
function initCopyButtons() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;

    const textToCopy = btn.dataset.copy;
    const success = await copyToClipboard(textToCopy);

    if (success) {
      btn.classList.add('copied');
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span>✓</span> Tersalin!`;
      showToast('Berhasil disalin!');
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = originalText;
      }, 2000);
    } else {
      showToast('Gagal menyalin. Coba manual.');
    }
  });
}

/**
 * Initialize share button
 */
function initShareButton() {
  const shareBtn = document.getElementById('btn-share');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: 'Kami mengundang Anda untuk hadir di acara pernikahan kami.',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy link to clipboard
      const success = await copyToClipboard(window.location.href);
      if (success) {
        showToast('Link undangan berhasil disalin!');
      } else {
        showToast('Gagal menyalin link.');
      }
    }
  });
}
