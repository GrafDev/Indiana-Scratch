// IMPORTS
import '../css/main.css'
import { initializeEntranceAnimations } from './appearance-animations.js'
import { showModal, hideModal } from './modal-animations.js'
import { generateHTML } from './html-template.js'
import { setupDevPanel, updateDevToggleText } from './dev-panel.js'
import { applyResponsiveSizing } from './responsive-sizing.js'
import { setupTouchControls } from './touch-controls.js'
import { CardInteractions } from './card-interactions.js'

// CONFIGURATION
let gameMode = import.meta.env.VITE_GAME_MODE || 'click';
const isDevelopment = import.meta.env.DEV;

// GAME MODE LOGIC
function updateGameMode() {
  // Update dev toggle text only in development
  updateDevToggleText(gameMode, isDevelopment);
  
  // Update body class for mode-specific styling
  document.body.classList.remove('mode-click', 'mode-auto');
  document.body.classList.add(`mode-${gameMode}`);
  
  console.log(`Game mode changed to: ${gameMode}`);
  
  // Game-specific logic based on mode
  if (gameMode === 'click') {
    console.log('Click mode: User needs to click to spin');
  } else {
    console.log('Auto mode: Wheel spins automatically');
  }
}

// Load saved mode from localStorage
const savedMode = localStorage.getItem('visitWheel_gameMode');
if (savedMode && (savedMode === 'click' || savedMode === 'auto')) {
  gameMode = savedMode;
}

// INITIALIZATION
document.querySelector('#app').innerHTML = generateHTML(isDevelopment);

// Setup development panel
setupDevPanel(gameMode, updateGameMode, isDevelopment);

// Initialize switcher only in development
if (isDevelopment) {
  const modeSwitcher = document.getElementById('modeSwitcher');
  if (modeSwitcher) {
    modeSwitcher.checked = gameMode === 'auto';
  }
}

// Initialize mode
updateGameMode();

// Setup responsive sizing
applyResponsiveSizing();
window.addEventListener('resize', applyResponsiveSizing);

// Setup touch controls
setupTouchControls();

// Initialize card interactions
const cardInteractions = new CardInteractions();

// Listen for card revealed events
document.addEventListener('cardRevealed', (e) => {
  const { cardBlock, percentage } = e.detail;
  console.log('Card revealed!', { cardBlock, percentage });
  
  // Here you can add game logic, like checking if all cards are revealed
  const revealedCount = cardInteractions.getRevealedCardsCount();
  if (revealedCount === 3) {
    console.log('All cards revealed! Game complete.');
    // Show modal or end game logic
  }
});

// Initialize animations after DOM is ready
setTimeout(() => {
  initializeEntranceAnimations();
}, 100);