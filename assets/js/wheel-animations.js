import { gsap } from 'gsap';

// Wheel animations for Indiana Scratch wheel variant
export class WheelAnimations {
    
    static wheelSpin(wheelElement, currentRotation, spinCount, gameMode = 'click') {
        return new Promise((resolve) => {
            if (!wheelElement) {
                console.warn('Wheel element not found');
                resolve();
                return;
            }

            // Calculate spin parameters
            const baseSpins = 3; // Minimum full rotations
            const randomSpins = Math.random() * 2; // 0-2 additional spins
            const totalSpins = baseSpins + randomSpins;
            
            // Final position (where wheel stops)
            const finalPositions = [0, 60, 120, 180, 240, 300]; // 6 sectors, 60 degrees each
            const randomPosition = finalPositions[Math.floor(Math.random() * finalPositions.length)];
            
            const totalRotation = currentRotation + (totalSpins * 360) + randomPosition;
            
            // Animation duration
            const duration = 3 + Math.random() * 2; // 3-5 seconds
            
            gsap.to(wheelElement, {
                rotation: totalRotation,
                duration: duration,
                ease: "power3.out",
                onComplete: () => {
                    resolve();
                }
            });
        });
    }

    static buttonGlow(buttonElement) {
        if (!buttonElement) return;
        
        gsap.set(buttonElement, {
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))'
        });
        
        gsap.to(buttonElement, {
            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 1))',
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }

    static stopButtonGlow(buttonElement) {
        if (!buttonElement) return;
        
        gsap.killTweensOf(buttonElement);
        gsap.to(buttonElement, {
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
            duration: 0.3
        });
    }

    static showModal(modalElement) {
        if (!modalElement) return;
        
        modalElement.style.display = 'flex';
        
        gsap.timeline()
            .set(modalElement, { opacity: 0 })
            .to(modalElement, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out"
            })
            .from('.modal-content', {
                scale: 0.3,
                rotation: 180,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, 0.2);
    }

    static hideModal(modalElement) {
        if (!modalElement) return;
        
        gsap.timeline()
            .to('.modal-content', {
                scale: 0.3,
                rotation: -180,
                duration: 0.5,
                ease: "back.in(1.7)"
            })
            .to(modalElement, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    modalElement.style.display = 'none';
                }
            }, 0.2);
    }
}