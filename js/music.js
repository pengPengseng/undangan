/* ============================================
   MUSIC — Audio Player Controller
   ============================================ */

/**
 * Initialize background music player
 */
function initMusicPlayer() {
  const player = document.getElementById('music-player');
  const btn = player?.querySelector('.music-player__btn');
  const audio = document.getElementById('bg-music');

  if (!player || !btn || !audio) return;

  let isPlaying = false;

  /**
   * Start playing music
   */
  function play() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        player.classList.remove('paused');
        btn.setAttribute('aria-label', 'Pause music');
      }).catch(() => {
        // Autoplay blocked — user needs to interact
        isPlaying = false;
        player.classList.add('paused');
      });
    }
  }

  /**
   * Pause music
   */
  function pause() {
    audio.pause();
    isPlaying = false;
    player.classList.add('paused');
    btn.setAttribute('aria-label', 'Play music');
  }

  /**
   * Toggle play/pause
   */
  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  // Click handler
  btn.addEventListener('click', toggle);

  // Show player
  function showPlayer() {
    player.classList.add('visible');
  }

  // Auto-play on cover open
  function startMusic() {
    audio.volume = 0.4;
    showPlayer();
    play();
  }

  return { startMusic, play, pause, toggle, showPlayer };
}
