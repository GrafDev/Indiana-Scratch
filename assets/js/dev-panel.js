// Development panel functionality

let devMode = false;

export function setupDevPanel(gameMode, updateGameMode, isDevelopment) {
  if (!isDevelopment) return;

  const devToggle = document.getElementById('devToggle');
  const devPanel = document.getElementById('devPanel');
  const showBordersCheckbox = document.getElementById('showBorders');
  const modeSwitcher = document.getElementById('modeSwitcher');

  devToggle.addEventListener('click', () => {
    devMode = !devMode;
    devPanel.style.display = devMode ? 'block' : 'none';
    updateGameMode();
  });

  // Initialize switcher based on current mode
  modeSwitcher.checked = gameMode === 'auto';
  devToggle.textContent = `DEV (${gameMode.toUpperCase()})`;

  showBordersCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('dev-borders');
    } else {
      document.body.classList.remove('dev-borders');
    }
  });

  // Mode switcher handler
  modeSwitcher.addEventListener('change', (e) => {
    gameMode = e.target.checked ? 'auto' : 'click';
    // Save mode before reload
    localStorage.setItem('visitWheel_gameMode', gameMode);
    updateGameMode();
    // Reload application to apply changes
    location.reload();
  });

  return { devMode, gameMode };
}

export function updateDevToggleText(gameMode, isDevelopment) {
  if (!isDevelopment) return;
  
  const devToggle = document.getElementById('devToggle');
  if (devToggle) {
    devToggle.textContent = devMode ? `HIDE DEV (${gameMode.toUpperCase()})` : `DEV (${gameMode.toUpperCase()})`;
  }
}