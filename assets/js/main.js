import '../css/main.css'
import { calculateWheelSize, getElementSize, gameConfig, calculateRotationAngle, getNextTargetSector } from './config.js'
import { gsap } from 'gsap'

// Import images using Vite
import bgMainImg from '../images/bg-main.png'
import bgMobileImg from '../images/bg-mobile.png'
import bgModalImg from '../images/bg-modal.png'
import buttonModalImg from '../images/button-modal.png'
import logo1Part1Img from '../images/logo1-part1.png'
import logo1Part2Img from '../images/logo1-part2.png'
import logo2Part1Img from '../images/logo2-part1.png'
import logo2Part2Img from '../images/logo2-part2.png'
import man1Img from '../images/man1.png'
import man2Img from '../images/man2.png'
import titleImg from '../images/title.png'
import wheelPart1Img from '../images/wheel-part1.png'
import wheelPart2Img from '../images/wheel-part2.png'
import wheelPart3Img from '../images/wheel-part3.png'
import wheelPart4Img from '../images/wheel-part4.png'
import wheelPart5Img from '../images/wheel-part5.png'
import wheelPart6Img from '../images/wheel-part6.png'
import wheelText1Img from '../images/wheel-text1.png'
import wheelText2Img from '../images/wheel-text2.png'
import arrowImg from '../images/arrow.png'

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
      <div class="box1">
        <div class="box-logo1">
          <img src="${logo1Part1Img}" alt="Logo 1 Part 1" class="logo1-part1">
          <img src="${logo1Part2Img}" alt="Logo 1 Part 2" class="logo1-part2">
        </div>
        <div class="box-man1"></div>
        <div class="spacer"></div>
      </div>
      <div class="box2">
        <div class="box-logo2">
          <img src="${logo2Part1Img}" alt="Logo 2 Part 1" class="logo2-part1">
          <img src="${logo2Part2Img}" alt="Logo 2 Part 2" class="logo2-part2">
        </div>
        <div class="box-man2"></div>
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
  
  console.log(`Wheel size set to: ${wheelSize}px`);
  console.log(`Main container width: ${mainContainerWidth}px`);
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
      
      // Анимация нажатия - кнопка, wheel-wrapper, part4 и arrow уменьшаются
      const wheelWrapper = document.querySelector('.wheel-wrapper');
      const part4 = document.querySelector('.wheel-part4');
      const arrow = document.querySelector('.arrow');
      
      gsap.timeline()
        // Уменьшение при нажатии
        .to([part5, part6], { duration: 0.1, scale: 0.28 }, 0)
        .to(wheelWrapper, { duration: 0.1, scale: 0.98 }, 0)
        .to(part4, { duration: 0.1, scale: 0.1 }, 0)
        // Start wheel spinning when button is fully pressed
        .call(() => {
          spinWheel(targetSector);
        }, [], 0.1)
        // Return wheel-wrapper to normal size
        .to(wheelWrapper, { duration: 0.2, scale: 1, ease: "back.out(1.5)" }, 0.1);
    };
    
    part5.addEventListener('click', handleClick);
    part6.addEventListener('click', handleClick);
    
    // Эффект при наведении - увеличиваем кнопку и добавляем мощное сияние part6
    const handleMouseEnter = (e) => {
      // Don't apply hover effects during spinning
      if (gameConfig.spinning.isSpinning) return;
      
      gsap.to([part5, part6], { duration: 0.2, scale: 0.32 });
      gsap.to(part6, { duration: 0.2, filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.5))" });
    };
    
    const handleMouseLeave = (e) => {
      // Don't apply hover effects during spinning
      if (gameConfig.spinning.isSpinning) return;
      
      gsap.to([part5, part6], { duration: 0.2, scale: 0.30 });
      gsap.to(part6, { duration: 0.2, filter: "drop-shadow(0 0 0px rgba(255, 255, 255, 0))" });
    };
    
    part5.addEventListener('mouseenter', handleMouseEnter);
    part5.addEventListener('mouseleave', handleMouseLeave);
    part6.addEventListener('mouseenter', handleMouseEnter);
    part6.addEventListener('mouseleave', handleMouseLeave);
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
  
  // Create spinning animation
  gsap.to(wheelWrapper, {
    rotation: finalAngle,
    duration: config.baseDuration,
    ease: "power2.out",
    onComplete: () => {
      // Update current sector
      config.currentSector = targetSector;
      config.isSpinning = false;
      
      console.log(`Колесо остановилось на секторе ${targetSector}`);
      
      // Scale part4 back to normal when wheel stops with brightness flash
      const part4 = document.querySelector('.wheel-part4');
      const part5 = document.querySelector('.wheel-part5');
      const part6 = document.querySelector('.wheel-part6');
      const wheelWrapper = document.querySelector('.wheel-wrapper');
      const arrow = document.querySelector('.arrow');
      
      gsap.timeline()
        .to(part4, { duration: 0.1, scale: 1, ease: "power2.out" })
        .to([part5, part6], { duration: 0.5, scale: 0.30, ease: "back.out(1.5)" }, 0)
        .call(() => {
          // Start wheel-text1 pulsing animation after wheel stops
          startWheelText1Pulsing();
          
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
    // Show modal overlay
    modalOverlay.style.display = 'flex';
    
    // Animate modal appearance
    gsap.timeline()
      .to(modalOverlay, {
        duration: 0.5,
        opacity: 1,
        ease: "power2.out"
      })
      .from('.modal-content', {
        duration: 0.6,
        scale: 0.3,
        ease: "back.out(1.7)"
      }, 0.2);
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