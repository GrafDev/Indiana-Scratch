import { gsap } from 'gsap'
import { calculateWheelSize } from './config.js'

// Modal functions
export function showModal() {
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

export function hideModal() {
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