import '../css/main.css'
import { calculateWheelSize, getElementSize, gameConfig, calculateRotationAngle, getNextTargetSector } from './config.js'
import { gsap } from 'gsap'


let devMode = false;
let gameMode = import.meta.env.VITE_GAME_MODE || 'click';
const isDevelopment = import.meta.env.DEV;

document.querySelector('#app').innerHTML = `
  <div class="bg-container">
    <div class="main-container">
      <div class="logo1">
        <img src="assets/images/logo1-part1.png" alt="Logo 1 Part 1" class="logo1-part1">
        <img src="assets/images/logo1-part2.png" alt="Logo 1 Part 2" class="logo1-part2">
      </div>
      <div class="title"></div>
      <div class="man1">
        <img src="assets/images/man1-part1.png" alt="Man 1 Part 1" class="man1-part1">
        <img src="assets/images/man1-part2.png" alt="Man 1 Part 2" class="man1-part2">
      </div>
      <div class="wheel-container">

      </div>
      <div class="man2">
        <img src="assets/images/man2-part1.png" alt="Man 2 Part 1" class="man2-part1">
        <img src="assets/images/man2-part2.png" alt="Man 2 Part 2" class="man2-part2">
      </div>
    </div>
    <div class="media-container">
      <div class="box1">
        <div class="box-man1">
          <img src="assets/images/man1-part1.png" alt="Man 1 Part 1" class="man1-part1">
          <img src="assets/images/man1-part2.png" alt="Man 1 Part 2" class="man1-part2">
        </div>
      </div>
      <div class="box2">
        <div class="box-man2">
          <img src="assets/images/man2-part1.png" alt="Man 2 Part 1" class="man2-part1">
          <img src="assets/images/man2-part2.png" alt="Man 2 Part 2" class="man2-part2">
        </div>
      </div>
    </div>
  </div>
  ${isDevelopment ? `
  <div class="dev-panel" id="devPanel" style="display: none;">
    <div class="dev-section">
      <h4>Game Mode</h4>
      <div class="mode-switcher">
        <span class="mode-label">Click</span>
        <label class="switch">
          <input type="checkbox" id="modeSwitcher">
          <span class="slider"></span>
        </label>
        <span class="mode-label">Auto</span>
      </div>
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

}

function updateGameMode() {
  // Update dev toggle text only in development
  if (isDevelopment) {
    const devToggle = document.getElementById('devToggle');
    if (devToggle) {
      devToggle.textContent = devMode ? `HIDE DEV (${gameMode.toUpperCase()})` : `DEV (${gameMode.toUpperCase()})`;
    }
  }
  
  // Game mode updated
  
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
}

// Initialize switcher only in development
if (isDevelopment) {
  const modeSwitcher = document.getElementById('modeSwitcher');
  if (modeSwitcher) {
    modeSwitcher.checked = gameMode === 'auto';
  }
}

// Initialize mode
updateGameMode();

// Set modal images src  
function setModalImages() {
  // Modal images removed - function kept for compatibility
}

// Apply responsive sizing
function applyResponsiveSizing() {
  const wheelSize = calculateWheelSize();
  
  // Get element sizes
  const logo1Size = getElementSize('logo1');
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const aspectRatio = screenWidth / screenHeight;
  
  // Use bigger mans for mobile (both portrait and landscape)
  const manSize = (aspectRatio < 0.6 || (aspectRatio > 1.6 && Math.min(screenWidth, screenHeight) <= 768)) 
    ? getElementSize('manMobile') 
    : getElementSize('man');
  const titleSize = getElementSize('title');
  const wheelElementSize = getElementSize('wheel');
  
  // Get main-container width
  const mainContainer = document.querySelector('.main-container');
  const mainContainerWidth = mainContainer.offsetWidth;
  
  // Set CSS custom properties
  document.documentElement.style.setProperty('--wheel-size', `${wheelSize}px`);
  document.documentElement.style.setProperty('--logo1-width', `${logo1Size.width}px`);
  document.documentElement.style.setProperty('--logo1-height', `${logo1Size.height}px`);
  document.documentElement.style.setProperty('--man-width', `${manSize.width}px`);
  document.documentElement.style.setProperty('--man-height', `${manSize.height}px`);
  document.documentElement.style.setProperty('--title-width', `${titleSize.width}px`);
  document.documentElement.style.setProperty('--title-height', `${titleSize.height}px`);
  document.documentElement.style.setProperty('--wheel-container-width', `${wheelElementSize.width}px`);
  document.documentElement.style.setProperty('--wheel-container-height', `${wheelElementSize.height}px`);
  // Set default media gap
  document.documentElement.style.setProperty('--max-media-gap', `${wheelSize * 1.4}px`);
  
  // Set modal size based on wheel size with aspect ratio 1.29
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    // Make modal bigger on mobile
    const screenWidth = window.innerWidth;
    const aspectRatio = screenWidth / window.innerHeight;
    let modalWidth = wheelSize;
    
    if (aspectRatio < 0.6) {
      // Mobile portrait: 95% of screen width
      modalWidth = screenWidth * 0.95;
    }
    
    modalContent.style.width = `${modalWidth}px`;
    modalContent.style.height = `${modalWidth / 1.29}px`;
  }
  
  console.log(`Wheel size set to: ${wheelSize}px`);
  console.log(`Main container width: ${mainContainerWidth}px`);
  
  // Man shine animations removed
}

// Apply sizing on load
applyResponsiveSizing();

// Reapply sizing on window resize
window.addEventListener('resize', applyResponsiveSizing);


// Initialize brightness animations immediately
setTimeout(() => {
  // Start logo1-part2 brightness animation
  startLogo1Part2Brightness();
  // Men shine animations removed
}, 500); // Wait for DOM to be ready



// Variable to store logo1-part2 brightness animation
let logo1Part2BrightnessAnimation = null;


// Man animations removed


// Start logo1-part2 brightness animation
function startLogo1Part2Brightness() {
  const logo1Part2Elements = document.querySelectorAll('.logo1-part2');
  
  // Stop existing animation if running
  if (logo1Part2BrightnessAnimation) {
    logo1Part2BrightnessAnimation.kill();
  }
  
  // Create infinite brightness pulsing animation
  logo1Part2BrightnessAnimation = gsap.fromTo(logo1Part2Elements, {
    filter: "brightness(0.7)"
  }, {
    filter: "brightness(1.4)",
    duration: 1.2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1
  });
}

// Stop logo1-part2 brightness animation
function stopLogo1Part2Brightness() {
  if (logo1Part2BrightnessAnimation) {
    logo1Part2BrightnessAnimation.kill();
    logo1Part2BrightnessAnimation = null;
    
    // Reset to normal brightness
    const logo1Part2Elements = document.querySelectorAll('.logo1-part2');
    gsap.set(logo1Part2Elements, { filter: "brightness(1)" });
  }
}




// Modal functions
function showModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  
  // Disable other animations during modal
  document.body.classList.add('modal-active');
  
  if (modalOverlay) {
    // Update modal size to match current wheel size with aspect ratio 1.29
    const wheelSize = calculateWheelSize();
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
      // Make modal bigger on mobile
      const screenWidth = window.innerWidth;
      const aspectRatio = screenWidth / window.innerHeight;
      let modalWidth = wheelSize;
      
      if (aspectRatio < 0.6) {
        // Mobile portrait: 95% of screen width
        modalWidth = screenWidth * 0.95;
      }
      
      modalContent.style.width = `${modalWidth}px`;
      modalContent.style.height = `${modalWidth / 1.29}px`;
    }
    
    // Setup initial state BEFORE showing modal
    const centerContainer = document.querySelector('.modal-bg-center');
    if (centerContainer) {
      // Show modal to get dimensions
      modalOverlay.style.display = 'flex';
      modalOverlay.style.opacity = '0';
      
      // Create shine elements
      const shine1 = document.createElement('div');
      shine1.className = 'modal-shine-1';
      const shine2 = document.createElement('div');
      shine2.className = 'modal-shine-1 modal-shine-perpendicular';
      modalOverlay.appendChild(shine1);
      modalOverlay.appendChild(shine2);
      
      const centerImg = centerContainer.querySelector('img');
      const modalBackground = document.querySelector('.modal-background');
      const finalWidth = modalBackground.offsetWidth * 0.734; // 73.4% от ширины родителя
      const startWidth = finalWidth * 0.08; // 8% от финальной ширины
      
      // Set initial narrow state
      gsap.set('.modal-bg-center', {
        width: `${startWidth}px`,
        overflow: 'hidden'
      });
      
      // Set initial button state
      gsap.set('.modal-button', {
        opacity: 0,
        scale: 0.2
      });
      
      // Force image natural width
      console.log('Looking for center image...');
      const img = centerContainer.querySelector('img');
      console.log('Found img:', img);
      if (img) {
        console.log('Image src before:', img.src);
        const setNaturalSize = () => {
          console.log('Image src:', img.src);
          console.log('Natural size:', img.naturalWidth, img.naturalHeight);
          console.log('Current size:', img.offsetWidth, img.offsetHeight);
          
          // Убираем все принудительные стили
          img.removeAttribute('style');
        };
        
        if (img.complete && img.naturalWidth > 0) {
          setNaturalSize();
        } else {
          img.onload = setNaturalSize;
        }
      }
      
      
      // Now animate
      gsap.timeline()
        .to(modalOverlay, {
          duration: 0.3,
          opacity: 1,
          ease: "power2.out"
        })
        .to('.modal-bg-center', {
          duration: 0.5,
          width: `${finalWidth}px`,
          ease: "power2.out"
        }, 0.2)
        .to('.modal-button', {
          duration: 0.4,
          opacity: 1,
          scale: 1.5,
          ease: "back.out(2.5)"
        }, 1.2)
        .to('.modal-shine-1', {
          duration: 0.1,
          opacity: 1,
          ease: "power2.out"
        }, 1.2)
        .to('.modal-shine-1', {
          duration: 0.1,
          opacity: 0,
          ease: "power2.out"
        }, 1.3)
        .to('.modal-shine-1', {
          duration: 0.1,
          opacity: 1,
          ease: "power2.out"
        }, 1.4)
        .to('.modal-shine-1', {
          duration: 0.1,
          opacity: 0,
          ease: "power2.out"
        }, 1.5)
        .to('.modal-shine-1', {
          duration: 0.2,
          opacity: 1,
          ease: "power2.out"
        }, 1.6)
        .to('.modal-bg-center img', {
          duration: 0.3,
          filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.2))',
          ease: "power2.out"
        }, 1.6)
        .call(() => {
          // Start continuous shine animation and add hover controls
          startModalButtonShine();
          addModalButtonHoverControls();
        }, [], 1.7);
    }
  }
}

function hideModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  
  // Re-enable other animations
  document.body.classList.remove('modal-active');
  
  if (modalOverlay) {
    // Animate modal disappearance
    gsap.timeline()
      .to('.modal-content', {
        duration: 0.3,
        scale: 0.3,
        ease: "back.in(1.7)"
      })
      .to(modalOverlay, {
        duration: 0.3,
        opacity: 0,
        ease: "power2.in",
        onComplete: () => {
          modalOverlay.style.display = 'none';
        }
      }, 0.1);
  }
}

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