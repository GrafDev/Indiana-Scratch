import '../css/main.css'
import { calculateWheelSize, getElementSize } from './config.js'

let devMode = false;
let gameMode = import.meta.env.VITE_GAME_MODE || 'click';
const isDevelopment = import.meta.env.DEV;

document.querySelector('#app').innerHTML = `
  <div class="bg-container">
    <div class="main-container">
      <div class="logo1"><img src="/assets/images/logo1.png" alt="Logo 1"></div>
      <div class="logo2"><img src="/assets/images/logo2.png" alt="Logo 2"></div>
      <div class="title"></div>
      <div class="man1"></div>
      <div class="wheel-container">
        <div class="wheel-wrapper">
          <div class="wheel-part1"></div>
          <div class="wheel-part2"></div>
          <div class="wheel-part3"></div>
          <div class="wheel-text1"></div>
          <div class="wheel-text2"></div>
        </div>
        <div class="wheel-part4"></div>
        <div class="wheel-part5"></div>
        <div class="wheel-part6"></div>
        <div class="arrow"></div>
      </div>
      <div class="man2"></div>
    </div>
    <div class="media-container">
      <div class="media1">
        <div class="logo1"><img src="/assets/images/logo1.png" alt="Logo 1"></div>
        <div class="man1"></div>
        <div class="spacer"></div>
      </div>
      <div class="media2">
        <div class="logo2"><img src="/assets/images/logo2.png" alt="Logo 2"></div>
        <div class="man2"></div>
        <div class="spacer"></div>
      </div>
    </div>
  </div>
  ${isDevelopment ? `
  <div class="dev-panel" id="devPanel" style="display: none;">
    <div class="dev-section">
      <h4>Game Mode</h4>
      <label>
        <input type="radio" name="gameMode" value="click" id="clickMode"> Click Mode
      </label>
      <label>
        <input type="radio" name="gameMode" value="auto" id="autoMode"> Auto Mode
      </label>
    </div>
    <div class="dev-section">
      <h4>Debug</h4>
      <label>
        <input type="checkbox" id="showBorders"> Показать рамки
      </label>
    </div>
  </div>
  <button class="dev-toggle" id="devToggle">DEV</button>
  ` : ''}
`

// Dev panel setup only in development
if (isDevelopment) {
  const devToggle = document.getElementById('devToggle');
  const devPanel = document.getElementById('devPanel');
  const showBordersCheckbox = document.getElementById('showBorders');
  const clickModeRadio = document.getElementById('clickMode');
  const autoModeRadio = document.getElementById('autoMode');

  devToggle.addEventListener('click', () => {
    devMode = !devMode;
    devPanel.style.display = devMode ? 'block' : 'none';
    updateGameMode();
  });

  // Initialize current mode
  if (gameMode === 'click') {
    clickModeRadio.checked = true;
  } else {
    autoModeRadio.checked = true;
  }

  devToggle.textContent = `DEV (${gameMode.toUpperCase()})`;

  showBordersCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('dev-borders');
    } else {
      document.body.classList.remove('dev-borders');
    }
  });

  // Game mode change handlers
  clickModeRadio.addEventListener('change', (e) => {
    if (e.target.checked) {
      gameMode = 'click';
      updateGameMode();
    }
  });

  autoModeRadio.addEventListener('change', (e) => {
    if (e.target.checked) {
      gameMode = 'auto';
      updateGameMode();
    }
  });
}

function updateGameMode() {
  // Update dev toggle text only in development
  if (isDevelopment) {
    const devToggle = document.getElementById('devToggle');
    if (devToggle) {
      devToggle.textContent = devMode ? `HIDE DEV (${gameMode.toUpperCase()})` : `DEV (${gameMode.toUpperCase()})`;
    }
  }
  
  // Store in localStorage for persistence
  localStorage.setItem('visitWheel_gameMode', gameMode);
  
  // Update body class for mode-specific styling
  document.body.classList.remove('mode-click', 'mode-auto');
  document.body.classList.add(`mode-${gameMode}`);
  
  console.log(`Game mode changed to: ${gameMode}`);
  
  // Here you can add game-specific logic based on mode
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
  
  // Update radio buttons only in development
  if (isDevelopment) {
    const clickModeRadio = document.getElementById('clickMode');
    const autoModeRadio = document.getElementById('autoMode');
    if (clickModeRadio && autoModeRadio) {
      if (gameMode === 'click') {
        clickModeRadio.checked = true;
      } else {
        autoModeRadio.checked = true;
      }
    }
  }
}

// Initialize mode
updateGameMode();

// Apply responsive sizing
function applyResponsiveSizing() {
  const wheelSize = calculateWheelSize();
  
  // Get element sizes
  const logo1Size = getElementSize('logo1');
  const logo2Size = getElementSize('logo2');
  const manSize = getElementSize('man');
  const titleSize = getElementSize('title');
  const wheelElementSize = getElementSize('wheel');
  
  // Set CSS custom properties
  document.documentElement.style.setProperty('--wheel-size', `${wheelSize}px`);
  document.documentElement.style.setProperty('--logo1-width', `${logo1Size.width}px`);
  document.documentElement.style.setProperty('--logo1-height', `${logo1Size.height}px`);
  document.documentElement.style.setProperty('--logo2-width', `${logo2Size.width}px`);
  document.documentElement.style.setProperty('--logo2-height', `${logo2Size.height}px`);
  document.documentElement.style.setProperty('--man-width', `${manSize.width}px`);
  document.documentElement.style.setProperty('--man-height', `${manSize.height}px`);
  document.documentElement.style.setProperty('--title-width', `${titleSize.width}px`);
  document.documentElement.style.setProperty('--title-height', `${titleSize.height}px`);
  document.documentElement.style.setProperty('--wheel-container-width', `${wheelElementSize.width}px`);
  document.documentElement.style.setProperty('--wheel-container-height', `${wheelElementSize.height}px`);
  // Set media gap based on device type
  const screenWidth = window.innerWidth;
  let mediaGapMultiplier = 1.5; // Default multiplier
  
  if (screenWidth > 1024) {
    // Desktop: slightly larger gap
    mediaGapMultiplier = 1.6;
  } else if (screenWidth > 768) {
    // Tablet: slightly wider gap
    mediaGapMultiplier = 1.55;
  }
  
  document.documentElement.style.setProperty('--max-media-gap', `${wheelSize * mediaGapMultiplier}px`);
  
  console.log(`Wheel size set to: ${wheelSize}px`);
}

// Apply sizing on load
applyResponsiveSizing();

// Reapply sizing on window resize
window.addEventListener('resize', applyResponsiveSizing);

// Disable zoom and scroll for all devices including multitouch
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
  // Allow single touch move for game interactions, prevent multi-touch
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchend', function(e) {
  if (e.touches.length > 0) {
    e.preventDefault();
  }
}, { passive: false });

// Disable double tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// Disable mouse wheel zoom
document.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// Disable keyboard zoom
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
    e.preventDefault();
  }
}, { passive: false });