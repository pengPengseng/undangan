/* ============================================
   GALLERY — Lightbox & Grid
   ============================================ */

/**
 * Initialize gallery lightbox
 */
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  let currentIndex = 0;
  const images = [];

  // Collect all gallery image sources
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      images.push({
        src: img.dataset.full || img.src,
        alt: img.alt || ''
      });

      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  function navigate(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    if (!images[currentIndex]) return;
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.95)';

    setTimeout(() => {
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 150);
  }

  // Event listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    switch (e.key) {
      case 'Escape': closeLightbox(); break;
      case 'ArrowLeft': navigate(-1); break;
      case 'ArrowRight': navigate(1); break;
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}
