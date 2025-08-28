// IMPORTS
import '../css/main.css'
import './images-loader.js' // Import all images to ensure they are included in build
import { ImagePreloader } from './preloader.js'
import { initializeEntranceAnimations } from './appearance-animations.js'
import { showModal, hideModal } from './modal-animations.js'
import { generateHTML } from './html-template.js'
import { generateWheelHTML } from './wheel-template.js'
import { setupDevPanel, updateDevToggleText } from './dev-panel.js'
import { applyResponsiveSizing } from './responsive-sizing.js'
import { setupTouchControls } from './touch-controls.js'
import { CardInteractions } from './card-interactions.js'
import { WheelGame } from './wheel-game.js'

// CONFIGURATION
let gameMode = import.meta.env.VITE_GAME_MODE || 'click';
let gameType = import.meta.env.VITE_GAME_TYPE || 'scratch';
const isDevelopment = import.meta.env.DEV;

// In development mode, check localStorage for saved game type
if (isDevelopment) {
  try {
    const savedState = JSON.parse(localStorage.getItem('indiana_scratch_dev_state') || '{}');
    if (savedState.gameType) {
      gameType = savedState.gameType;
    }
  } catch (error) {
    console.warn('Failed to load dev state for game type:', error);
  }
}

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

// PRELOADER INITIALIZATION
const preloader = new ImagePreloader();
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const preloaderElement = document.getElementById('preloader');
const appElement = document.getElementById('app');

// Set up progress callback
preloader.setProgressCallback((progress, loaded, total) => {
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress}%`;
  console.log(`Loading progress: ${progress}% (${loaded}/${total})`);
});

// Start preloading
async function initializeApp() {
  try {
    console.log('Starting image preload...');
    await preloader.loadAllImages();
    console.log('All images loaded successfully!');
    
    // Hide preloader and show app
    preloaderElement.classList.add('fade-out');
    
    setTimeout(() => {
      preloaderElement.style.display = 'none';
      
      // INITIALIZATION
      console.log(`Initializing game type: ${gameType}`);
      if (gameType === 'wheel') {
        console.log('Using wheel template');
        appElement.innerHTML = generateWheelHTML(isDevelopment);
      } else {
        console.log('Using scratch template');
        appElement.innerHTML = generateHTML(isDevelopment);
      }
      appElement.style.opacity = '1';
      
      initializeGameLogic();
    }, 500);
    
  } catch (error) {
    console.error('Error during preloading:', error);
    // Still show the app even if some images failed to load
    preloaderElement.style.display = 'none';
    appElement.innerHTML = generateHTML(isDevelopment);
    appElement.style.opacity = '1';
    initializeGameLogic();
  }
}

// Game initialization logic
function initializeGameLogic() {

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

  // Setup responsive sizing for SIZES only (not positioning)
  applyResponsiveSizing();
  window.addEventListener('resize', applyResponsiveSizing);

  // Setup touch controls
  setupTouchControls();

  // Initialize game based on type
  console.log(`Initializing game logic for type: ${gameType}`);
  if (gameType === 'wheel') {
    console.log('Initializing wheel game');
    // Initialize wheel game
    const wheelGame = new WheelGame();
    
    // Initialize animations for wheel elements
    setTimeout(() => {
      initializeEntranceAnimations();
    }, 100);
  } else {
    console.log('Initializing card game');
    // Initialize card interactions for scratch game
    const cardInteractions = new CardInteractions();

    // Listen for card revealed events
    document.addEventListener('cardRevealed', (e) => {
      const { cardBlock, percentage } = e.detail;
      
      // Here you can add game logic, like checking if all cards are revealed
      const revealedCount = cardInteractions.getRevealedCardsCount();
      if (revealedCount === 3) {
        // All cards revealed! Game complete.
      }
    });

    // Initialize animations after DOM is ready
    setTimeout(() => {
      initializeEntranceAnimations();
    }, 100);
  }
}

// Start the app
initializeApp();