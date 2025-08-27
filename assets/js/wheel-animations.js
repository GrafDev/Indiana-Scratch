import { gsap } from 'gsap';

// Wheel animations based on Visit Wheel logic
export class WheelAnimations {
    
    static wheelSpin(currentRotation, targetDegrees) {
        const wheelWrapper = document.querySelector('.wheel-wrapper');
        if (!wheelWrapper) {
            console.warn('Wheel wrapper not found');
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const minSpins = 5;
            const maxSpins = 7;
            const randomSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
            
            // Add overshoot for spring effect
            const overshoot = 10; // degrees
            const totalRotationWithOvershoot = currentRotation + (randomSpins * 360) + targetDegrees + overshoot;
            const finalRotation = currentRotation + (randomSpins * 360) + targetDegrees;
            
            console.log(`Spinning to ${targetDegrees}°, total rotation: ${finalRotation}`);
            
            // Two-stage animation: fast spin + spring settle
            gsap.timeline()
                .to(wheelWrapper, {
                    rotation: totalRotationWithOvershoot,
                    duration: 3.5 + Math.random() * 0.5,
                    ease: "power2.out"
                })
                .to(wheelWrapper, {
                    rotation: finalRotation,
                    duration: 0.8,
                    ease: "elastic.out(2, 0.3)",
                    onComplete: () => {
                        resolve(finalRotation);
                    }
                });
        });
    }

    static buttonPress() {
        const part5 = document.querySelector('.wheel-part5');
        const part6 = document.querySelector('.wheel-part6');
        
        if (!part5 || !part6) return;
        
        return gsap.timeline()
            .to([part5, part6], { 
                duration: 0.15, 
                scale: 0.88,
                rotate: -5,
                ease: 'back.in(1.5)' 
            })
            .to([part5, part6], { 
                duration: 0.4, 
                scale: 1.12, 
                rotate: 3,
                ease: "elastic.out(1.2, 0.6)" 
            })
            .to([part5, part6], { 
                duration: 0.3, 
                scale: 1.0,
                rotate: 0,
                ease: "power2.out" 
            });
    }

    static entranceAnimations() {
        // Similar to Visit Wheel entrance animations
        const tl = gsap.timeline();
        
        // Set initial states
        tl.set('.wheel-wrapper', {
            opacity: 0,
            scale: 0.2,
            rotation: -90
        })
        .set(['.wheel-part5', '.wheel-part6'], {
            opacity: 0,
            scale: 0
        })
        .set('.wheel-part4', {
            opacity: 0
        })
        .set('.arrow', {
            opacity: 0,
            y: -150,
            scale: 0
        });
        
        // Entrance animations
        tl.to('.wheel-wrapper', {
            duration: 1.0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            ease: "back.out(1.5)"
        }, 0)
        .to(['.wheel-part5', '.wheel-part6'], {
            duration: 0.6,
            scale: 1.0,
            opacity: 1,
            ease: "back.out(1.5)"
        }, 0.6)
        .to('.arrow', {
            duration: 0.7,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "bounce.out"
        }, 0);
        
        return tl;
    }
}