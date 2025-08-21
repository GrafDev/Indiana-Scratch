import { gsap } from 'gsap'
import { startLogo1Part2Animation } from './logo-animations.js'

// Initialize entrance animations
export function initializeEntranceAnimations() {
  // Show all hidden elements with entrance animation
  gsap.timeline()
    .to('.title', {
      duration: 0.5,
      opacity: 1,
      ease: "power2.out"
    })
    .to('.main-container .logo1', {
      duration: 0.5,
      opacity: 1,
      ease: "power2.out"
    }, 0.1)
    .to('.box1 .man1, .box2 .man2', {
      duration: 0.5,
      opacity: 1,
      scale: 1,
      y: 0,
      ease: "back.out(1.7)"
    }, 0.2)
    .call(() => {
      // Start logo continuous animation after entrance is complete
      startLogo1Part2Animation();
    }, [], 1.0);
}

