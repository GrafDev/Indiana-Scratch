import '../css/main.css'

let devMode = false;
let gameMode = import.meta.env.VITE_GAME_MODE || 'click';
const isDevelopment = import.meta.env.DEV;

document.querySelector('#app').innerHTML = `
  <div class="bg-container">
    <div class="main-wheel-container">
      <h1>Visit Wheel</h1>
      <div class="card">
        <p>
          Добро пожаловать в проект Visit Wheel!
        </p>
      </div>
      <p class="read-the-docs">
        Измените <code>main.js</code> и сохраните, чтобы увидеть обновления.
      </p>
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