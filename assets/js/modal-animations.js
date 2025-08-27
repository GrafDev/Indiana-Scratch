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
        // Mobile portrait: 75% of screen width
        modalWidth = screenWidth * 0.75;
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
      
      // Remove existing shine elements first
      const existingShines = modalOverlay.querySelectorAll('.modal-shine-1');
      existingShines.forEach(shine => shine.remove());
      
      // Create shine elements
      const shine1 = document.createElement('div');
      shine1.className = 'modal-shine-1';
      shine1.style.zIndex = '1';
      const shine2 = document.createElement('div');
      shine2.className = 'modal-shine-1 modal-shine-perpendicular';
      shine2.style.zIndex = '1';
      modalOverlay.appendChild(shine1);
      modalOverlay.appendChild(shine2);
      
      const centerImg = centerContainer.querySelector('img');
      const modalBackground = document.querySelector('.modal-background');
      const finalWidth = modalBackground.offsetWidth * 1.04; // 104% от ширины родителя
      const startWidth = finalWidth * 0.08; // 8% от финальной ширины
      
      // Set initial narrow state
      gsap.set('.modal-bg-center', {
        width: `${startWidth}px`,
        overflow: 'hidden'
      });
      
      // Set initial button state
      gsap.set('.modal-button-container', {
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
        .to('.modal-button-container', {
          duration: 0.6,
          opacity: 1,
          scale: 1.5,
          ease: "elastic.out(1.2, 0.75)"
        }, 1.2)
        .to('.modal-shine-1', {
          duration: 0.5,
          opacity: 0.8,
          ease: "power2.out"
        }, 1.2)
        .call(() => {
          // Modal animation complete
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