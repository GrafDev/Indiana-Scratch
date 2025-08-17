import '../css/main.css'
import { calculateWheelSize, getElementSize } from './config.js'
import { gsap } from 'gsap'

let devMode = false;
let gameMode = import.meta.env.VITE_GAME_MODE || 'click';
const isDevelopment = import.meta.env.DEV;

document.querySelector('#app').innerHTML = `
  <div class="bg-container">
    <div class="main-container">
      <div class="logo1">
        <img src="/assets/images/logo1-part1.png" alt="Logo 1 Part 1" class="logo1-part1">
        <img src="/assets/images/logo1-part2.png" alt="Logo 1 Part 2" class="logo1-part2">
      </div>
      <div class="logo2">
        <img src="/assets/images/logo2-part1.png" alt="Logo 2 Part 1" class="logo2-part1">
        <img src="/assets/images/logo2-part2.png" alt="Logo 2 Part 2" class="logo2-part2">
      </div>
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
        <div class="logo1">
          <img src="/assets/images/logo1-part1.png" alt="Logo 1 Part 1" class="logo1-part1">
          <img src="/assets/images/logo1-part2.png" alt="Logo 1 Part 2" class="logo1-part2">
        </div>
        <div class="man1"></div>
        <div class="spacer"></div>
      </div>
      <div class="media2">
        <div class="logo2">
          <img src="/assets/images/logo2-part1.png" alt="Logo 2 Part 1" class="logo2-part1">
          <img src="/assets/images/logo2-part2.png" alt="Logo 2 Part 2" class="logo2-part2">
        </div>
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
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const aspectRatio = screenWidth / screenHeight;
  
  // Use bigger mans for mobile (both portrait and landscape)
  const manSize = (aspectRatio < 0.6 || (aspectRatio > 1.6 && Math.min(screenWidth, screenHeight) <= 768)) 
    ? getElementSize('manMobile') 
    : getElementSize('man');
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
  // Set default media gap
  document.documentElement.style.setProperty('--max-media-gap', `${wheelSize * 1.5}px`);
  
  console.log(`Wheel size set to: ${wheelSize}px`);
}

// Apply sizing on load
applyResponsiveSizing();

// Reapply sizing on window resize
window.addEventListener('resize', applyResponsiveSizing);

// GSAP Animation system
function initEntranceAnimations() {
  const tl = gsap.timeline();
  
  // Сначала установим начальные состояния для всех элементов
  tl.set([
    '.main-container .man1',
    '.main-container .man2',
    '.main-container .logo1', 
    '.main-container .logo2',
    '.title',
    '.wheel-wrapper',
    '.wheel-part4',
    '.wheel-part5', 
    '.wheel-part6',
    '.arrow'
  ], { opacity: 0 })
  
  // Man1 в main-container - простое fade появление
  .set('.main-container .man1', {
    opacity: 0
  })
  
  // Man2 в main-container - простое fade появление
  .set('.main-container .man2', {
    opacity: 0
  })
  
  // Logo1 и Logo2 в main-container - начальные значения
  .set('.main-container .logo1', {
    opacity: 0
  })
  .set('.main-container .logo2', {
    opacity: 0
  })
  
  // Title - появляется сверху
  .set('.title', {
    y: -80,
    scale: 0.5
  })
  
  // Wheel-wrapper - появляется с центра
  .set('.wheel-wrapper', {
    scale: 0.2,
    rotation: -90
  })
  
  // Part4 - появляется с масштабированием
  .set('.wheel-part4', {
    scale: 0
  })
  
  // Part5 - появляется с масштабированием и поворотом
  .set('.wheel-part5', {
    scale: 0,
    rotation: 180
  })
  
  // Part6 - появляется с масштабированием
  .set('.wheel-part6', {
    scale: 0
  })
  
  // Arrow - появляется сверху
  .set('.arrow', {
    y: -150,
    scale: 0
  })
  
  // Mans в media-container - начальные состояния с 0
  .set('.media1 .man1', {
    x: 0,
    y: 0,
    scale: 0,
    rotationY: 180,
    rotationZ: 0
  })
  .set('.media2 .man2', {
    x: 0,
    y: 0,
    scale: 0,
    rotationY: -180,
    rotationZ: 0
  })
  
  // Логотипы в media-container - начальные состояния
  .set('.media1 .logo1', {
    opacity: 0
  })
  .set('.media2 .logo2', {
    opacity: 0
  })
  
  // Все анимации появления одновременно (0s)
  
  // Title
  .to('.title', {
    duration: 0.8,
    y: 0,
    scale: 1,
    opacity: 1,
    ease: "back.out(1.7)"
  }, 0)
  
  // Wheel-wrapper
  .to('.wheel-wrapper', {
    duration: 1.0,
    scale: 1,
    rotation: 0,
    opacity: 1,
    ease: "back.out(1.5)"
  }, 0)
  
  // Part4 - начальное состояние (будет анимироваться отдельно)
  .set('.wheel-part4', {
    scale: 0,
    opacity: 0
  })
  
  // Part5 - с уменьшенным scale до 0.30
  .to('.wheel-part5', {
    duration: 0.8,
    scale: 0.30,
    rotation: 0,
    opacity: 1,
    ease: "back.out(1.7)"
  }, 0)
  
  // Part6 - с уменьшенным scale до 0.30
  .to('.wheel-part6', {
    duration: 0.6,
    scale: 0.30,
    opacity: 1,
    ease: "back.out(1.5)"
  }, 0)
  
  // Arrow
  .to('.arrow', {
    duration: 0.7,
    y: 0,
    scale: 1,
    opacity: 1,
    ease: "bounce.out"
  }, 0)
  
  // Logo1 в main-container - fade появление
  .to('.main-container .logo1', {
    duration: 0.8,
    opacity: 1,
    ease: "power2.out"
  }, 0)
  
  // Logo2 в main-container - fade появление
  .to('.main-container .logo2', {
    duration: 0.8,
    opacity: 1,
    ease: "power2.out"
  }, 0)
  
  // Man1 в main-container - простое fade
  .to('.main-container .man1', {
    duration: 0.8,
    opacity: 1,
    ease: "power2.out"
  }, 0)
  
  // Man2 в main-container - простое fade
  .to('.main-container .man2', {
    duration: 0.8,
    opacity: 1,
    ease: "power2.out"
  }, 0)
  
  // Mans в media-container - ФАЗА 1 быстрее + ФАЗА 2 медленнее
  .to('.media1 .man1', {
    duration: 0.6, // ФАЗА 1: быстрее
    x: 105, // ФАЗА 1: к позиции +105px
    y: 0,
    scale: 0.8,
    rotationY: 90,
    opacity: 1,
    ease: "power2.out"
  }, 0)
  .to('.media2 .man2', {
    duration: 0.6, // ФАЗА 1: быстрее
    x: -105, // ФАЗА 1: к позиции -105px
    y: 0,
    scale: 0.8,
    rotationY: -90,
    opacity: 1,
    ease: "power2.out"
  }, 0)
  
  // ФАЗА 2: медленнее, сразу после первой фазы (0.6s)
  .to('.media1 .man1', {
    duration: 1.2, // ФАЗА 2: медленнее
    x: 0,
    y: 0,
    scale: 1,
    rotationY: 0,
    ease: "back.out(1.2)"
  }, 0.6)
  .to('.media2 .man2', {
    duration: 1.2, // ФАЗА 2: медленнее
    x: 0,
    y: 0,
    scale: 1,
    rotationY: 0,
    ease: "back.out(1.2)"
  }, 0.6)
  
  // Part4 - появляется еще раньше через fade  
  .to('.wheel-part4', {
    duration: 0.8,
    scale: 1,
    opacity: 1,
    ease: "power2.out"
  }, 0.8) // еще раньше - в 0.8s
  
  // Логотипы в media-container - fade появление
  .to('.media1 .logo1', {
    duration: 0.8,
    opacity: 1,
    ease: "power2.out"
  }, 0)
  .to('.media2 .logo2', {
    duration: 0.8,
    opacity: 1,
    ease: "power2.out"
  }, 0);
}

// Initialize entrance animations AFTER DOM is ready
setTimeout(() => {
  initEntranceAnimations();
  
  // Инициализируем кнопки после завершения анимации part5
  setTimeout(() => {
    initButtonHandlers();
  }, 1000); // После завершения анимации part5
}, 500); // Ждем 500ms чтобы все точно загрузилось

// Part5 и Part6 как кнопка для нажатия (весь блок)
function initButtonHandlers() {
  const part5 = document.querySelector('.wheel-part5');
  const part6 = document.querySelector('.wheel-part6');
  
  // Добавляем стили для кнопки (БЕЗ изменения размера - размер контролирует GSAP)
  if (part5 && part6) {
    [part5, part6].forEach(el => {
      el.style.cursor = 'pointer';
      el.style.userSelect = 'none';
    });
    
    // Обработчик клика с анимацией нажатия
    const handleClick = () => {
      console.log('Колесо нажато! Запуск вращения...');
      
      // Анимация нажатия - кнопка, wheel-wrapper, part4 и arrow уменьшаются
      const wheelWrapper = document.querySelector('.wheel-wrapper');
      const part4 = document.querySelector('.wheel-part4');
      const arrow = document.querySelector('.arrow');
      
      gsap.timeline()
        // Уменьшение при нажатии
        .to([part5, part6], { duration: 0.1, scale: 0.28 }, 0)
        .to(wheelWrapper, { duration: 0.1, scale: 0.98 }, 0)
        .to(part4, { duration: 0.1, scale: 0.98 }, 0)
        .to(arrow, { duration: 0.1, scale: 0.98 }, 0)
        // Возврат к нормальному размеру
        .to([part5, part6], { duration: 0.2, scale: 0.30, ease: "back.out(1.5)" }, 0.1)
        .to(wheelWrapper, { duration: 0.2, scale: 1, ease: "back.out(1.5)" }, 0.1)
        .to(part4, { duration: 0.2, scale: 1, ease: "back.out(1.5)" }, 0.1)
        .to(arrow, { duration: 0.2, scale: 1, ease: "back.out(1.5)" }, 0.1);
      
      // Здесь будет логика вращения колеса
    };
    
    part5.addEventListener('click', handleClick);
    part6.addEventListener('click', handleClick);
    
    // Эффект при наведении - увеличиваем кнопку и добавляем мощное сияние part6
    const handleMouseEnter = (e) => {
      gsap.to([part5, part6], { duration: 0.2, scale: 0.32 });
      gsap.to(part6, { duration: 0.2, filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.5))" });
    };
    
    const handleMouseLeave = (e) => {
      gsap.to([part5, part6], { duration: 0.2, scale: 0.30 });
      gsap.to(part6, { duration: 0.2, filter: "drop-shadow(0 0 0px rgba(255, 255, 255, 0))" });
    };
    
    part5.addEventListener('mouseenter', handleMouseEnter);
    part5.addEventListener('mouseleave', handleMouseLeave);
    part6.addEventListener('mouseenter', handleMouseEnter);
    part6.addEventListener('mouseleave', handleMouseLeave);
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