import { gsap } from 'gsap'

// Variable to store logo1-part2 animation
let logo1Part2Animation = null;

// Start logo1-part2 continuous animation
export function startLogo1Part2Animation() {
  const logo1Part2Elements = document.querySelectorAll('.logo1-part2');
  
  // Stop existing animation if running
  if (logo1Part2Animation) {
    logo1Part2Animation.kill();
  }
  
  // Create timeline with pulsing and rotation
  logo1Part2Animation = gsap.timeline({ repeat: -1 });
  
  // Add pulsing brightness and glow animation
  logo1Part2Animation.fromTo(logo1Part2Elements, {
    filter: "brightness(1) drop-shadow(0 0 10px rgba(255, 255, 0, 0.3))"
  }, {
    filter: "brightness(1.4) drop-shadow(0 0 25px rgba(255, 255, 0, 0.8))",
    duration: 1.2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1
  }, 0);
  
  // Add slow rotation around the offset point
  logo1Part2Animation.to(logo1Part2Elements, {
    rotation: 360,
    duration: 12,
    ease: "none",
    repeat: -1,
    transformOrigin: "56.4% 46.5%"
  }, 0);
}

// Stop logo1-part2 animation
export function stopLogo1Part2Animation() {
  if (logo1Part2Animation) {
    logo1Part2Animation.kill();
    logo1Part2Animation = null;
    
    // Reset to normal state
    const logo1Part2Elements = document.querySelectorAll('.logo1-part2');
    gsap.set(logo1Part2Elements, { 
      filter: "brightness(1) drop-shadow(0 0 0px rgba(255, 255, 0, 0))",
      rotation: 0
    });
  }
}