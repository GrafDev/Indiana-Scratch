import '../css/main.css'
import { calculateWheelSize, getElementSize, gameConfig, calculateRotationAngle, getNextTargetSector } from './config.js'
import { gsap } from 'gsap'

// Import images using Vite
import bgMainImg from '../images/bg-main.png'
import bgMobileImg from '../images/bg-mobile.png'
import bgModalLeftImg from '../images/bg-modal-left.png'
import bgModalCenterImg from '../images/bg-modal-center.png'
import bgModalRightImg from '../images/bg-modal-right.png'
import buttonModalImg from '../images/button-modal.png'
import logo1Part1Img from '../images/logo1-part1.png'
import logo1Part2Img from '../images/logo1-part2.png'
import logo2Part1Img from '../images/logo2-part1.png'
import logo2Part2Img from '../images/logo2-part2.png'
import man1Part1Img from '../images/man1-part1.png'
import man1Part2Img from '../images/man1-part2.png'
import man2Part1Img from '../images/man2-part1.png'
import man2Part2Img from '../images/man2-part2.png'
import titleImg from '../images/title.png'
import wheelPart1Img from '../images/wheel-part1.png'
import wheelPart2Img from '../images/wheel-part2.png'
import wheelPart3Img from '../images/wheel-part3.png'
import wheelPart4Img from '../images/wheel-part4.png'
import wheelPart5Img from '../images/wheel-part5.png'
import wheelPart6Img from '../images/wheel-part6.png'
import wheelText1Img from '../images/wheel-text1.png'
import wheelText2Img from '../images/wheel-text2.png'
import arrowPart1Img from '../images/arrow-part1.png'
import arrowPart2Img from '../images/arrow-part2.png'

let devMode = false;
let gameMode = import.meta.env.VITE_GAME_MODE || 'click';
const isDevelopment = import.meta.env.DEV;

document.querySelector('#app').innerHTML = `
  <div class="bg-container">
    <div class="main-container">
      <div class="logo1">
        <img src="${logo1Part1Img}" alt="Logo 1 Part 1" class="logo1-part1">
        <img src="${logo1Part2Img}" alt="Logo 1 Part 2" class="logo1-part2">
      </div>
      <div class="logo2">
        <img src="${logo2Part1Img}" alt="Logo 2 Part 1" class="logo2-part1">
        <img src="${logo2Part2Img}" alt="Logo 2 Part 2" class="logo2-part2">
      </div>
      <div class="title"></div>
      <div class="man1">
        <img src="${man1Part1Img}" alt="Man 1 Part 1" class="man1-part1">
        <img src="${man1Part2Img}" alt="Man 1 Part 2" class="man1-part2">
      </div>
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
        <div class="arrow">
          <img src="${arrowPart1Img}" alt="Arrow Part 1" class="arrow-part1">
          <img src="${arrowPart2Img}" alt="Arrow Part 2" class="arrow-part2">
        </div>
      </div>
      <div class="man2">
        <img src="${man2Part1Img}" alt="Man 2 Part 1" class="man2-part1">
        <img src="${man2Part2Img}" alt="Man 2 Part 2" class="man2-part2">
      </div>
    </div>
    <div class="media-container">
      <div class="box1">
        <div class="box-logo1">
          <img src="${logo1Part1Img}" alt="Logo 1 Part 1" class="logo1-part1">
          <img src="${logo1Part2Img}" alt="Logo 1 Part 2" class="logo1-part2">
        </div>
        <div class="box-man1">
          <img src="${man1Part1Img}" alt="Man 1 Part 1" class="man1-part1">
          <img src="${man1Part2Img}" alt="Man 1 Part 2" class="man1-part2">
        </div>
        <div class="spacer"></div>
      </div>
      <div class="box2">
        <div class="box-logo2">
          <img src="${logo2Part1Img}" alt="Logo 2 Part 1" class="logo2-part1">
          <img src="${logo2Part2Img}" alt="Logo 2 Part 2" class="logo2-part2">
        </div>
        <div class="box-man2">
          <img src="${man2Part1Img}" alt="Man 2 Part 1" class="man2-part1">
          <img src="${man2Part2Img}" alt="Man 2 Part 2" class="man2-part2">
        </div>
        <div class="spacer"></div>
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
  const leftImg = document.querySelector('.modal-bg-left');
  const centerImg = document.querySelector('.modal-bg-center img');
  const rightImg = document.querySelector('.modal-bg-right');
  
  if (leftImg) leftImg.src = bgModalLeftImg;
  if (centerImg) centerImg.src = bgModalCenterImg;
  if (rightImg) rightImg.src = bgModalRightImg;
}

// Apply modal images when DOM is ready
setTimeout(() => {
  setModalImages();
}, 100);

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
  
  // Get main-container width
  const mainContainer = document.querySelector('.main-container');
  const mainContainerWidth = mainContainer.offsetWidth;
  
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
  document.documentElement.style.setProperty('--max-media-gap', `${wheelSize * 1.4}px`);
  
  // Set modal size based on wheel size
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.style.width = `${wheelSize}px`;
    modalContent.style.height = `${wheelSize}px`;
  }
  
  console.log(`Wheel size set to: ${wheelSize}px`);
  console.log(`Main container width: ${mainContainerWidth}px`);
  
  // Recreate dynamic shine elements with new size and position
  const wheelPart3Shine = document.querySelector('.wheel-part3-shine');
  if (wheelPart3Shine) {
    startWheelPart3Shine();
  }
  
  const man1ShineElements = document.querySelectorAll('.man1-shine-div');
  if (man1ShineElements.length > 0) {
    stopMan1Part2Brightness();
    startMan1Part2Brightness();
  }
  
  const man2ShineElements = document.querySelectorAll('.man2-shine-div');
  if (man2ShineElements.length > 0) {
    stopMan2Part2Brightness();
    startMan2Part2Brightness();
  }
  
  const arrowShineElements = document.querySelectorAll('.arrow-shine-div');
  if (arrowShineElements.length > 0) {
    stopArrowPart2Brightness();
    startArrowPart2Brightness();
  }
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
  
  // Mans в media-container - начальные состояния изза экрана
  .set('.box1 .box-man1', {
    x: -300, // За левым краем экрана
    y: 0,
    scale: 0.3,
    rotationY: 180,
    rotationZ: 0,
    opacity: 0
  })
  .set('.box2 .box-man2', {
    x: 300, // За правым краем экрана
    y: 0,
    scale: 0.3,
    rotationY: -180,
    rotationZ: 0,
    opacity: 0
  })
  
  // Логотипы в media-container - начальные состояния
  .set('.box1 .box-logo1', {
    opacity: 0
  })
  .set('.box2 .box-logo2', {
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
  
  // Mans в media-container - ФАЗА 1: летят изза экрана к начальной позиции
  .to('.box1 .box-man1', {
    duration: 0.4, // ФАЗА 1: быстрее
    x: 0, // ФАЗА 1: к начальной позиции
    y: 0,
    scale: 0.3,
    rotationY: 180,
    opacity: 1,
    ease: "none"
  }, 0)
  .to('.box2 .box-man2', {
    duration: 0.4, // ФАЗА 1: быстрее
    x: 0, // ФАЗА 1: к начальной позиции
    y: 0,
    scale: 0.3,
    rotationY: -180,
    opacity: 1,
    ease: "none"
  }, 0)
  
  // ФАЗА 2: к промежуточной позиции (точно в 0.4s)
  .to('.box1 .box-man1', {
    duration: 0.6,
    x: 105,
    y: 0,
    scale: 0.8,
    rotationY: 90,
    ease: "power2.out"
  }, 0.4)
  .to('.box2 .box-man2', {
    duration: 0.6,
    x: -105,
    y: 0,
    scale: 0.8,
    rotationY: -90,
    ease: "power2.out"
  }, 0.4)
  
  // ФАЗА 3: к финальной позиции (точно в 1.0s)
  .to('.box1 .box-man1', {
    duration: 1.2,
    x: 0,
    y: 0,
    scale: 1,
    rotationY: 0,
    ease: "back.out(1.2)"
  }, 1.0)
  .to('.box2 .box-man2', {
    duration: 1.2,
    x: 0,
    y: 0,
    scale: 1,
    rotationY: 0,
    ease: "back.out(1.2)"
  }, 1.0)
  
  // Part4 - появляется еще раньше через fade  
  .to('.wheel-part4', {
    duration: 0.8,
    scale: 1,
    opacity: 1,
    ease: "power2.out"
  }, 0.8) // еще раньше - в 0.8s
  
  // Логотипы в media-container - fade появление
  .to('.box1 .box-logo1', {
    duration: 0.8,
    opacity: 1,
    ease: "power2.out"
  }, 0)
  .to('.box2 .box-logo2', {
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
    // Start wheel-text1 pulsing after appears animation
    startWheelText1Pulsing();
    // Start logo1-part2 brightness animation
    startLogo1Part2Brightness();
    // Start logo2-part2 brightness animation
    startLogo2Part2Brightness();
    // Start man1-part2 brightness animation
    startMan1Part2Brightness();
    // Start man2-part2 brightness animation
    startMan2Part2Brightness();
    // Start wheel-part3 radial shine animation
    startWheelPart3Shine();
    // Start wheel-part1 shine animation
    startWheelPart1Shine();
    // Start wheel-part6 breathing animation
    startWheelPart6Breathing();
    // Add hover controls to breathing animation
    setTimeout(() => addWheelPart6HoverControls(), 100);
    // Start arrow-part2 brightness animation
    startArrowPart2Brightness();
    
    // Auto start first spin in auto mode after all animations
    if (gameMode === 'auto') {
      setTimeout(() => {
        const part5 = document.querySelector('.wheel-part5');
        if (part5) {
          part5.click();
        }
      }, 1500); // Start after 1.5 seconds when everything is ready
    }
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
      // Check if already spinning
      if (gameConfig.spinning.isSpinning) {
        console.log('Колесо уже вращается!');
        return;
      }
      
      // Get next target sector
      const targetSector = getNextTargetSector();
      if (targetSector === null) {
        console.log('Все вращения завершены!');
        return;
      }
      
      console.log(`Колесо нажато! Запуск вращения к сектору ${targetSector}...`);
      
      
      // Set spinning flag
      gameConfig.spinning.isSpinning = true;
      
      // Stop wheel-text1 pulsing animation
      stopWheelText1Pulsing();
      
      // Stop ALL wheel-part6 animations during spin
      stopWheelPart6Breathing();
      
      // Reset wheel-part6 to normal appearance (remove any hover effects)
      const part5 = document.querySelector('.wheel-part5');
      const part6 = document.querySelector('.wheel-part6');
      if (part6) {
        gsap.set(part6, {
          opacity: 1,
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))'
        });
      }
      
      // Remove cursor pointer during spin
      if (part5) part5.style.cursor = 'default';
      if (part6) part6.style.cursor = 'default';
      
      // Анимация нажатия - кнопка, wheel-wrapper, part4 и arrow уменьшаются
      const wheelWrapper = document.querySelector('.wheel-wrapper');
      const part4 = document.querySelector('.wheel-part4');
      const arrow = document.querySelector('.arrow');
      
      gsap.timeline()
        // Уменьшение при нажатии
        .to([part5, part6], { duration: 0.2, scale: 0.28, ease: 'power2.out' }, 0)
        .to(wheelWrapper, { duration: 0.2, scale: 0.98, ease: 'power2.out' }, 0)
        .to(part4, { duration: 0.2, scale: 0.1, ease: 'power2.out' }, 0)
        // Start wheel spinning when button is fully pressed
        .call(() => {
          spinWheel(targetSector);
        }, [], 0.2)
        // Return wheel-wrapper to normal size
        .to(wheelWrapper, { duration: 0.2, scale: 1, ease: "back.out(1.5)" }, 0.1);
    };
    
    part5.addEventListener('click', handleClick);
    part6.addEventListener('click', handleClick);
    
  }
}

// Variable to store pulsing animation
let part4PulsingAnimation = null;

// Start part4 pulsing animation
function startPart4Pulsing() {
  const part4 = document.querySelector('.wheel-part4');
  
  // Stop any existing pulsing
  if (part4PulsingAnimation) {
    part4PulsingAnimation.kill();
  }
  
  // Create infinite pulsing animation
  part4PulsingAnimation = gsap.to(part4, {
    filter: "brightness(1.8)",
    duration: 0.4,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
}

// Stop part4 pulsing animation
function stopPart4Pulsing() {
  if (part4PulsingAnimation) {
    part4PulsingAnimation.kill();
    part4PulsingAnimation = null;
    
    // Reset to normal brightness
    const part4 = document.querySelector('.wheel-part4');
    gsap.set(part4, { filter: "brightness(1)" });
  }
}

// Variable to store wheel-text1 pulsing animation
let wheelText1PulsingAnimation = null;

// Variable to store logo1-part2 brightness animation
let logo1Part2BrightnessAnimation = null;

// Variable to store logo2-part2 brightness animation
let logo2Part2BrightnessAnimation = null;

// Variable to store man1-part2 brightness animation
let man1Part2BrightnessAnimation = null;

// Variable to store man2-part2 brightness animation
let man2Part2BrightnessAnimation = null;

// Variable to store wheel-part3 radial shine animation
let wheelPart3ShineAnimation = null;
let wheelPart1ShineAnimation = null;
let wheelPart6BreathingAnimation = null;
let arrowPart2ShineAnimation = null;

// Function to create wheel-text shine effect on wheel stop
function createWheelTextShine(textNumber) {
  const wheelText = document.querySelector(`.wheel-text${textNumber}`);
  if (!wheelText) return;
  
  // Strobe effect with multiple flashes
  gsap.timeline()
    // First big flash
    .to(wheelText, {
      filter: "brightness(3) drop-shadow(0 0 25px rgba(255,255,255,1))",
      duration: 0.08,
      ease: "power2.out"
    })
    .to(wheelText, {
      filter: "brightness(1.2) drop-shadow(0 0 5px rgba(255,255,255,0.3))",
      duration: 0.12,
      ease: "power2.out"
    })
    // Second flash (smaller)
    .to(wheelText, {
      filter: "brightness(2.2) drop-shadow(0 0 18px rgba(255,255,255,0.8))",
      duration: 0.06,
      ease: "power2.out"
    })
    .to(wheelText, {
      filter: "brightness(1.1) drop-shadow(0 0 3px rgba(255,255,255,0.2))",
      duration: 0.1,
      ease: "power2.out"
    })
    // Third flash (quick)
    .to(wheelText, {
      filter: "brightness(2.8) drop-shadow(0 0 22px rgba(255,255,255,0.9))",
      duration: 0.05,
      ease: "power2.out"
    })
    .to(wheelText, {
      filter: "brightness(1.05) drop-shadow(0 0 2px rgba(255,255,255,0.1))",
      duration: 0.08,
      ease: "power2.out"
    })
    // Final fade out
    .to(wheelText, {
      filter: "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))",
      duration: 0.5,
      ease: "power2.out"
    });
}

// Start wheel-text1 concentric pulsing animation
function startWheelText1Pulsing() {
  const wheelText1 = document.querySelector('.wheel-text1');
  if (!wheelText1) return;
  
  // Stop existing animation if running
  if (wheelText1PulsingAnimation) {
    wheelText1PulsingAnimation.kill();
  }
  
  // Simple pulsing without complex effects
  wheelText1PulsingAnimation = gsap.timeline({ repeat: -1 })
    .to(wheelText1, {
      duration: 1,
      ease: "power2.inOut",
      opacity: 0.7,
      yoyo: true,
      repeat: 1
    });
}

// Stop wheel-text1 pulsing animation
function stopWheelText1Pulsing() {
  if (wheelText1PulsingAnimation) {
    wheelText1PulsingAnimation.kill();
    wheelText1PulsingAnimation = null;
    
    // Reset to normal state
    const wheelText1 = document.querySelector('.wheel-text1');
    if (wheelText1) {
      gsap.set(wheelText1, { 
        opacity: 1
      });
    }
  }
}

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

// Start logo2-part2 brightness animation
function startLogo2Part2Brightness() {
  const logo2Part2Elements = document.querySelectorAll('.logo2-part2');
  
  // Stop existing animation if running
  if (logo2Part2BrightnessAnimation) {
    logo2Part2BrightnessAnimation.kill();
  }
  
  // Create infinite brightness pulsing animation
  logo2Part2BrightnessAnimation = gsap.fromTo(logo2Part2Elements, {
    filter: "brightness(0.7)"
  }, {
    filter: "brightness(1.4)",
    duration: 1.2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1
  });
}

// Stop logo2-part2 brightness animation
function stopLogo2Part2Brightness() {
  if (logo2Part2BrightnessAnimation) {
    logo2Part2BrightnessAnimation.kill();
    logo2Part2BrightnessAnimation = null;
    
    // Reset to normal brightness
    const logo2Part2Elements = document.querySelectorAll('.logo2-part2');
    gsap.set(logo2Part2Elements, { filter: "brightness(1)" });
  }
}

// Start man1-part2 brightness animation
function startMan1Part2Brightness() {
  const man1Part2Elements = document.querySelectorAll('.man1-part2');
  
  // Stop existing animation if running
  if (man1Part2BrightnessAnimation) {
    man1Part2BrightnessAnimation.kill();
  }
  
  // Create real div elements for shine (псевдоэлементы не работают на img)
  man1Part2Elements.forEach(element => {
    const parent = element.parentElement;
    
    // Get element position and size
    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    
    // Create shine div positioned exactly over part2
    const shine = document.createElement('div');
    shine.className = 'man1-shine-div';
    shine.style.cssText = `
      position: absolute;
      top: ${element.offsetTop}px;
      left: ${element.offsetLeft}px;
      width: ${element.offsetWidth}px;
      height: ${element.offsetHeight}px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        transparent 40%, 
        rgba(255,255,255,0.4) 50%, 
        transparent 60%,
        transparent 100%
      );
      background-size: 300% 100%;
      background-position: -100% 0;
      -webkit-mask-image: url('${man1Part2Img}');
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-image: url('${man1Part2Img}');
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      pointer-events: none;
      z-index: 2;
    `;
    
    // Insert after the man1-part2 image
    parent.insertBefore(shine, element.nextSibling);
  });
  
  // Animate shine position
  const shineElements = document.querySelectorAll('.man1-shine-div');
  man1Part2BrightnessAnimation = gsap.fromTo(shineElements, {
    backgroundPosition: '-150% 0'
  }, {
    backgroundPosition: '150% 0',
    duration: 2.8,
    ease: 'power2.out',
    repeat: -1,
    repeatDelay: 2.3
  });
}

// Stop man1-part2 brightness animation
function stopMan1Part2Brightness() {
  if (man1Part2BrightnessAnimation) {
    man1Part2BrightnessAnimation.kill();
    man1Part2BrightnessAnimation = null;
    
    // Remove shine div elements
    const shineElements = document.querySelectorAll('.man1-shine-div');
    shineElements.forEach(shine => {
      if (shine.parentNode) {
        shine.parentNode.removeChild(shine);
      }
    });
  }
}

// Start man2-part2 brightness animation
function startMan2Part2Brightness() {
  const man2Part2Elements = document.querySelectorAll('.man2-part2');
  
  // Stop existing animation if running
  if (man2Part2BrightnessAnimation) {
    man2Part2BrightnessAnimation.kill();
  }
  
  // Create real div elements for shine (псевдоэлементы не работают на img)
  man2Part2Elements.forEach(element => {
    const parent = element.parentElement;
    
    // Get element position and size
    const rect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    
    // Create shine div positioned exactly over part2
    const shine = document.createElement('div');
    shine.className = 'man2-shine-div';
    shine.style.cssText = `
      position: absolute;
      top: ${element.offsetTop}px;
      left: ${element.offsetLeft}px;
      width: ${element.offsetWidth}px;
      height: ${element.offsetHeight}px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        transparent 40%, 
        rgba(255,255,255,0.4) 50%, 
        transparent 60%,
        transparent 100%
      );
      background-size: 300% 100%;
      background-position: -100% 0;
      -webkit-mask-image: url('${man2Part2Img}');
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-image: url('${man2Part2Img}');
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      pointer-events: none;
      z-index: 2;
    `;
    
    // Insert after the man2-part2 image
    parent.insertBefore(shine, element.nextSibling);
  });
  
  // Animate shine position
  const shineElements = document.querySelectorAll('.man2-shine-div');
  man2Part2BrightnessAnimation = gsap.fromTo(shineElements, {
    backgroundPosition: '-150% 0'
  }, {
    backgroundPosition: '150% 0',
    duration: 4.2,
    ease: 'power2.out',
    repeat: -1,
    repeatDelay: 1.2
  });
}

// Stop man2-part2 brightness animation
function stopMan2Part2Brightness() {
  if (man2Part2BrightnessAnimation) {
    man2Part2BrightnessAnimation.kill();
    man2Part2BrightnessAnimation = null;
    
    // Remove shine div elements
    const shineElements = document.querySelectorAll('.man2-shine-div');
    shineElements.forEach(shine => {
      if (shine.parentNode) {
        shine.parentNode.removeChild(shine);
      }
    });
  }
}

// Start wheel-part3 shine animation
function startWheelPart3Shine() {
  const wheelPart3 = document.querySelector('.wheel-part3');
  if (!wheelPart3) return;
  
  // Stop existing animation if running
  if (wheelPart3ShineAnimation) {
    wheelPart3ShineAnimation.kill();
  }
  
  // Remove existing shine element
  const existingShine = document.querySelector('.wheel-part3-shine');
  if (existingShine && existingShine.parentNode) {
    existingShine.parentNode.removeChild(existingShine);
  }
  
  const parent = wheelPart3.parentElement;
  
  // Get element position and size
  const rect = wheelPart3.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  
  // Create shine div positioned exactly over wheel-part3
  const shine = document.createElement('div');
  shine.className = 'wheel-part3-shine';
  shine.style.cssText = `
    position: absolute;
    top: ${wheelPart3.offsetTop}px;
    left: ${wheelPart3.offsetLeft}px;
    width: ${wheelPart3.offsetWidth}px;
    height: ${wheelPart3.offsetHeight}px;
    background: linear-gradient(90deg, 
      transparent 20%, 
      rgba(255,255,255,0.8) 50%, 
      transparent 80%
    );
    -webkit-mask-image: url('${wheelPart3Img}');
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url('${wheelPart3Img}');
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    pointer-events: none;
    z-index: 20;
    transform-origin: center center;
  `;
  
  // Insert after the wheel-part3 element
  parent.insertBefore(shine, wheelPart3.nextSibling);
  
  // Animate slow continuous rotation
  const shineElement = document.querySelector('.wheel-part3-shine');
  
  wheelPart3ShineAnimation = gsap.to(shineElement, {
    rotation: 360,
    duration: 8, // Slow rotation
    ease: 'none',
    repeat: -1
  });
}

// Stop wheel-part3 radial shine animation
function stopWheelPart3Shine() {
  if (wheelPart3ShineAnimation) {
    wheelPart3ShineAnimation.kill();
    wheelPart3ShineAnimation = null;
    
    // Remove shine element
    const shine = document.querySelector('.wheel-part3-shine');
    if (shine && shine.parentNode) {
      shine.parentNode.removeChild(shine);
    }
  }
}

// Speed up wheel-part3 shine during wheel spin
function speedUpWheelPart3Shine() {
  const shineElement = document.querySelector('.wheel-part3-shine');
  if (!shineElement) return;
  
  if (wheelPart3ShineAnimation) {
    wheelPart3ShineAnimation.kill();
  }
  
  wheelPart3ShineAnimation = gsap.to(shineElement, {
    rotation: "+=1440", // Fast rotation (4 full turns)
    duration: 1,
    ease: 'none',
    repeat: -1
  });
}

// Slow down wheel-part3 shine after wheel stops
function slowDownWheelPart3Shine() {
  const shineElement = document.querySelector('.wheel-part3-shine');
  if (!shineElement) return;
  
  if (wheelPart3ShineAnimation) {
    wheelPart3ShineAnimation.kill();
  }
  
  // Get current rotation to continue smoothly
  const currentRotation = gsap.getProperty(shineElement, "rotation") || 0;
  
  wheelPart3ShineAnimation = gsap.fromTo(shineElement, {
    rotation: currentRotation
  }, {
    rotation: currentRotation + 360,
    duration: 8, // Back to slow rotation
    ease: 'elastic.out(1, 0.3)', // Spring-like deceleration
    repeat: -1
  });
}

// Start wheel-part1 shine animation
function startWheelPart1Shine() {
  const wheelPart1 = document.querySelector('.wheel-part1');
  if (!wheelPart1) return;
  
  wheelPart1ShineAnimation = gsap.to(wheelPart1, {
    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.6))',
    duration: 1,
    ease: 'power3.inOut',
    yoyo: true,
    repeat: -1
  });
}

// Stop wheel-part1 shine animation
function stopWheelPart1Shine() {
  if (wheelPart1ShineAnimation) {
    wheelPart1ShineAnimation.kill();
    wheelPart1ShineAnimation = null;
    
    const wheelPart1 = document.querySelector('.wheel-part1');
    if (wheelPart1) {
      gsap.set(wheelPart1, { filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' });
    }
  }
}

// Start wheel-part6 breathing animation (based on click animation)
function startWheelPart6Breathing() {
  const wheelPart5 = document.querySelector('.wheel-part5');
  const wheelPart6 = document.querySelector('.wheel-part6');
  if (!wheelPart5 || !wheelPart6) return;
  
  // Set initial state to normal size
  gsap.set([wheelPart5, wheelPart6], { scale: 0.30 });
  
  // Create heartbeat-like pulsation - "tuk-tuk" with pause, starting from normal state
  wheelPart6BreathingAnimation = gsap.timeline({ repeat: -1 })
    // Start with pause (normal state)
    .to([wheelPart5, wheelPart6], {
      scale: 0.30,
      duration: 0.5,
      ease: 'none'
    })
    // First "tuk"
    .to([wheelPart5, wheelPart6], {
      scale: 0.28,
      duration: 0.15,
      ease: 'power2.out'
    })
    .to([wheelPart5, wheelPart6], {
      scale: 0.30,
      duration: 0.2,
      ease: 'power2.out'
    })
    // Small pause between "tuk-tuk"
    .to([wheelPart5, wheelPart6], {
      scale: 0.30,
      duration: 0.1,
      ease: 'none'
    })
    // Second "tuk"
    .to([wheelPart5, wheelPart6], {
      scale: 0.28,
      duration: 0.15,
      ease: 'power2.out'
    })
    .to([wheelPart5, wheelPart6], {
      scale: 0.30,
      duration: 0.2,
      ease: 'power2.out'
    })
    // Longer pause between heartbeats
    .to([wheelPart5, wheelPart6], {
      scale: 0.30,
      duration: 0.5,
      ease: 'none'
    });
}

// Stop wheel-part6 breathing animation
function stopWheelPart6Breathing() {
  if (wheelPart6BreathingAnimation) {
    wheelPart6BreathingAnimation.kill();
    wheelPart6BreathingAnimation = null;
    
    const wheelPart5 = document.querySelector('.wheel-part5');
    const wheelPart6 = document.querySelector('.wheel-part6');
    if (wheelPart5 && wheelPart6) {
      gsap.set([wheelPart5, wheelPart6], { 
        scale: 0.3,
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))'
      });
    }
  }
}

// Start arrow-part2 shine animation
function startArrowPart2Brightness() {
  const arrowPart2Elements = document.querySelectorAll('.arrow-part2');
  
  // Stop existing animation if running
  if (arrowPart2ShineAnimation) {
    arrowPart2ShineAnimation.kill();
  }
  
  // Create real div elements for shine
  arrowPart2Elements.forEach(element => {
    const parent = element.parentElement;
    
    // Create shine div positioned exactly over arrow-part2
    const shine = document.createElement('div');
    shine.className = 'arrow-shine-div';
    shine.style.cssText = `
      position: absolute;
      top: ${element.offsetTop}px;
      left: ${element.offsetLeft}px;
      width: ${element.offsetWidth}px;
      height: ${element.offsetHeight}px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        transparent 40%, 
        rgba(255,255,255,0.6) 50%, 
        transparent 60%,
        transparent 100%
      );
      background-size: 300% 100%;
      background-position: -100% 0;
      -webkit-mask-image: url('${arrowPart2Img}');
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-image: url('${arrowPart2Img}');
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
      pointer-events: none;
      z-index: 20;
    `;
    
    // Insert after the arrow-part2 image
    parent.insertBefore(shine, element.nextSibling);
  });
  
  // Animate shine position
  const shineElements = document.querySelectorAll('.arrow-shine-div');
  arrowPart2ShineAnimation = gsap.fromTo(shineElements, {
    backgroundPosition: '-150% 0'
  }, {
    backgroundPosition: '150% 0',
    duration: 3.7,
    ease: 'power2.out',
    repeat: -1,
    repeatDelay: 1.8
  });
}

// Stop arrow-part2 shine animation
function stopArrowPart2Brightness() {
  if (arrowPart2ShineAnimation) {
    arrowPart2ShineAnimation.kill();
    arrowPart2ShineAnimation = null;
    
    // Remove shine element
    const shine = document.querySelector('.arrow-part2-shine');
    if (shine && shine.parentNode) {
      shine.parentNode.removeChild(shine);
    }
  }
}

// Variable to store modal button shine animation
let modalButtonShineAnimation = null;

// Start modal button shine animation (always running)
function startModalButtonShine() {
  const modalButton = document.querySelector('.modal-button');
  if (!modalButton) return;
  
  // Stop existing animation if running
  if (modalButtonShineAnimation) {
    modalButtonShineAnimation.kill();
  }
  
  // Remove existing shine element
  const existingShine = document.querySelector('.modal-button-shine');
  if (existingShine && existingShine.parentNode) {
    existingShine.parentNode.removeChild(existingShine);
  }
  
  // Create shine div positioned exactly over modal button
  const shine = document.createElement('div');
  shine.className = 'modal-button-shine';
  shine.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      transparent 45%, 
      rgba(255,255,255,0.5) 50%, 
      transparent 55%,
      transparent 100%
    );
    background-size: 300% 100%;
    background-position: -100% 0;
    -webkit-mask-image: url('${buttonModalImg}');
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-image: url('${buttonModalImg}');
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    pointer-events: none;
    z-index: 4;
  `;
  
  // Insert shine element into modal button
  modalButton.appendChild(shine);
  
  // Animate shine position with repeat from left to right
  modalButtonShineAnimation = gsap.fromTo(shine, {
    backgroundPosition: '-150% 0'
  }, {
    backgroundPosition: '150% 0',
    duration: 1.2,
    ease: 'power2.out',
    repeat: -1,
    repeatDelay: 2.5
  });
}

// Stop modal button shine animation
function stopModalButtonShine() {
  if (modalButtonShineAnimation) {
    modalButtonShineAnimation.kill();
    modalButtonShineAnimation = null;
  }
  
  // Remove shine element
  const shine = document.querySelector('.modal-button-shine');
  if (shine && shine.parentNode) {
    shine.parentNode.removeChild(shine);
  }
}

// Add hover controls to modal button (shadow effect)
function addModalButtonHoverControls() {
  const modalButton = document.querySelector('.modal-button');
  if (!modalButton) return;
  
  modalButton.addEventListener('mouseenter', () => {
    // Add light shadow and scale up on hover
    gsap.to(modalButton, {
      filter: 'drop-shadow(0 8px 20px rgba(255, 255, 255, 0.4))',
      scale: 1.5,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  modalButton.addEventListener('mouseleave', () => {
    // Remove shadow and scale back on mouse leave
    gsap.to(modalButton, {
      filter: 'none',
      scale: 1.4,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
}

// Add hover controls to breathing animation
function addWheelPart6HoverControls() {
  const wheelPart5 = document.querySelector('.wheel-part5');
  const wheelPart6 = document.querySelector('.wheel-part6');
  if (!wheelPart5 || !wheelPart6 || !wheelPart6BreathingAnimation) return;
  
  [wheelPart5, wheelPart6].forEach(element => {
    element.addEventListener('mouseenter', () => {
      if (!gameConfig.spinning.isSpinning) {
        // Make pulsation tiny and fast - like trying to break free
        if (wheelPart6BreathingAnimation) {
          wheelPart6BreathingAnimation.kill();
          // Create tiny pulsation with same timing as heartbeat
          wheelPart6BreathingAnimation = gsap.timeline({ repeat: -1 })
            // First tiny "tuk"
            .to([wheelPart5, wheelPart6], {
              scale: 0.295,
              duration: 0.15,
              ease: 'power2.out'
            })
            .to([wheelPart5, wheelPart6], {
              scale: 0.30,
              duration: 0.2,
              ease: 'power2.out'
            })
            // Small pause between "tuk-tuk"
            .to([wheelPart5, wheelPart6], {
              scale: 0.30,
              duration: 0.1,
              ease: 'none'
            })
            // Second tiny "tuk"
            .to([wheelPart5, wheelPart6], {
              scale: 0.295,
              duration: 0.15,
              ease: 'power2.out'
            })
            .to([wheelPart5, wheelPart6], {
              scale: 0.30,
              duration: 0.2,
              ease: 'power2.out'
            })
            // Longer pause between heartbeats
            .to([wheelPart5, wheelPart6], {
              scale: 0.30,
              duration: 1,
              ease: 'none'
            });
        }
        
        gsap.to(wheelPart6, {
          opacity: 0.95,
          filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 1))',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
    element.addEventListener('mouseleave', () => {
      if (!gameConfig.spinning.isSpinning) {
        // Restart normal heartbeat pulsation
        startWheelPart6Breathing();
        
        gsap.to(wheelPart6, {
          opacity: 1,
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  });
}

// Wheel spinning animation function
function spinWheel(targetSector) {
  const wheelWrapper = document.querySelector('.wheel-wrapper');
  const config = gameConfig.spinning;
  
  // Get current total rotation from wheel element
  const currentTotalRotation = gsap.getProperty(wheelWrapper, "rotation") || 0;
  
  // Calculate rotation angle
  const finalAngle = calculateRotationAngle(targetSector, currentTotalRotation);
  
  console.log(`Вращение колеса: от сектора ${config.currentSector} к сектору ${targetSector}`);
  console.log(`Текущий поворот: ${currentTotalRotation} градусов`);
  console.log(`Финальный угол поворота: ${finalAngle} градусов`);
  
  // Speed up wheel-part3 shine during spin
  speedUpWheelPart3Shine();
  
  // Create spinning animation with spring stop
  gsap.timeline()
    .to(wheelWrapper, {
      rotation: finalAngle + 6, // Overshoot by 6 degrees
      duration: config.baseDuration,
      ease: "power2.out"
    })
    .to(wheelWrapper, {
      rotation: finalAngle - 8, // Swing back 
      duration: 0.2,
      ease: "power2.inOut"
    })
    .to(wheelWrapper, {
      rotation: finalAngle + 4, // Swing forward
      duration: 0.15,
      ease: "power2.inOut"
    })
    .to(wheelWrapper, {
      rotation: finalAngle - 2, // Small swing back
      duration: 0.1,
      ease: "power2.inOut"
    })
    .to(wheelWrapper, {
      rotation: finalAngle, // Finally settle
      duration: 0.1,
      ease: "power2.out",
      onComplete: () => {
        // Update current sector
        config.currentSector = targetSector;
        config.isSpinning = false;
      
      console.log(`Колесо остановилось на секторе ${targetSector}`);
      
      // Slow down wheel-part3 shine after wheel stops
      slowDownWheelPart3Shine();
      
      // Restart wheel-part6 breathing animation after wheel stops (with delay to avoid conflict)
      setTimeout(() => {
        startWheelPart6Breathing();
      }, 1000); // Wait for button animation to complete
      
      // Scale part4 back to normal when wheel stops with brightness flash
      const part4 = document.querySelector('.wheel-part4');
      const part5 = document.querySelector('.wheel-part5');
      const part6 = document.querySelector('.wheel-part6');
      const wheelWrapper = document.querySelector('.wheel-wrapper');
      const arrow = document.querySelector('.arrow');
      
      // Restore cursor pointer after wheel stops
      if (part5) part5.style.cursor = 'pointer';
      if (part6) part6.style.cursor = 'pointer';
      
      gsap.timeline()
        .to(part4, { duration: 0.1, scale: 1, ease: "power2.out" })
        .to([part5, part6], { duration: 0.8, scale: 0.30, ease: "elastic.out(1, 0.5)" }, 0)
        .call(() => {
          // Create shine effect when wheel stops - text1 after first stop, text2 after second stop
          if (config.currentSpinIndex === 1) {
            // First spin completed - show text1 shine
            createWheelTextShine(1);
            // Start wheel-text1 pulsing animation after wheel stops and shine effect
            setTimeout(() => {
              startWheelText1Pulsing();
            }, 1000); // Wait for shine effect to complete (1.0s)
          } else if (config.currentSpinIndex === 2) {
            // Second spin completed - show text2 shine
            createWheelTextShine(2);
            // Don't start wheel-text1 pulsing after second spin
          }
          
          // Auto spin next wheel if in auto mode
          if (gameMode === 'auto') {
            setTimeout(() => {
              const nextTargetSector = getNextTargetSector();
              if (nextTargetSector !== null) {
                // Simulate button click
                const part5 = document.querySelector('.wheel-part5');
                if (part5) {
                  part5.click();
                }
              }
            }, gameConfig.autoMode.autoSpinDelay);
          }
        });
      
      // Check if modal should be shown
      const shouldShowModal = gameMode === 'auto'
        ? config.currentSpinIndex >= 1  // Show after first spin in auto mode
        : config.currentSpinIndex >= config.targetSectors.length; // Show after all spins in click mode
      
      if (shouldShowModal) {
        console.log('Показываем модальное окно!');
        setTimeout(() => {
          showModal();
        }, 3000); // Wait 3 seconds before showing modal
      }
      
      // Check if more spins are available
      if (config.currentSpinIndex >= config.targetSectors.length) {
        console.log('Все запланированные вращения завершены!');
      } else {
        console.log(`Осталось вращений: ${config.targetSectors.length - config.currentSpinIndex}`);
      }
      }
    });
}

// Modal functions
function showModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  
  if (modalOverlay) {
    // Update modal size to match current wheel size
    const wheelSize = calculateWheelSize();
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.width = `${wheelSize}px`;
      modalContent.style.height = `${wheelSize}px`;
    }
    
    // Setup initial state BEFORE showing modal
    const centerContainer = document.querySelector('.modal-bg-center');
    if (centerContainer) {
      // Show modal to get dimensions
      modalOverlay.style.display = 'flex';
      modalOverlay.style.opacity = '0';
      
      const centerImg = centerContainer.querySelector('img');
      const finalWidth = centerImg ? centerImg.naturalWidth : centerContainer.offsetWidth;
      const startWidth = finalWidth * 0.08; // 8% от финальной ширины
      
      // Set initial narrow state
      gsap.set('.modal-bg-center', {
        width: `${startWidth}px`,
        overflow: 'hidden'
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
          
          // Принудительно через setAttribute
          img.setAttribute('style', `
            width: ${img.naturalWidth}px !important;
            height: ${img.naturalHeight}px !important;
            min-width: ${img.naturalWidth}px !important;
            max-width: ${img.naturalWidth}px !important;
            object-fit: none !important;
            flex-shrink: 0 !important;
          `);
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
          duration: 0.5,
          opacity: 1,
          ease: "power2.out"
        })
        .to('.modal-bg-center', {
          duration: 0.8,
          width: `${finalWidth}px`,
          ease: "power2.out"
        }, 0.4)
        .to('.modal-button', {
          duration: 0.5,
          opacity: 1,
          scale: 1.4,
          ease: "power1.out"
        }, 1.2)
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