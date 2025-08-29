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
            
            // Initialize rotation-based flashing
            this.initRotationBasedFlashing(currentRotation, totalRotationWithOvershoot, finalRotation);
            
            // First flash immediately
            this.arrowFlash();
            
            // Two-stage animation: fast spin + spring settle
            const spinTimeline = gsap.timeline();
            
            // First stage - fast spin with rotation tracking
            spinTimeline.to(wheelWrapper, {
                rotation: totalRotationWithOvershoot,
                duration: 3.5 + Math.random() * 0.5,
                ease: "power2.out",
                onUpdate: function() {
                    WheelAnimations.checkRotationForFlash(gsap.getProperty(this.targets()[0], "rotation"));
                }
            })
            // Second stage - spring settle
            .to(wheelWrapper, {
                rotation: finalRotation,
                duration: 0.8,
                ease: "elastic.out(2, 0.3)",
                onUpdate: function() {
                    WheelAnimations.checkRotationForFlash(gsap.getProperty(this.targets()[0], "rotation"));
                },
                onComplete: () => {
                    // Stop flashing and trigger celebration immediately with part4 show
                    this.stopRotationBasedFlashing();
                    this.arrowCelebrationFlash();
                    this.showPart4();
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

    static initRotationBasedFlashing(startRotation, maxRotation, finalRotation) {
        this.lastFlashRotation = startRotation;
        this.flashInterval = 45; // degrees between flashes
        this.isFlashing = true;
    }

    static stopRotationBasedFlashing() {
        this.isFlashing = false;
        this.lastFlashRotation = 0;
    }

    static checkRotationForFlash(currentRotation) {
        if (!this.isFlashing) return;
        
        const rotation = parseFloat(currentRotation) || 0;
        
        // Check if we've rotated enough for next flash
        const rotationSinceLastFlash = Math.abs(rotation - this.lastFlashRotation);
        
        if (rotationSinceLastFlash >= this.flashInterval) {
            this.arrowFlash();
            this.lastFlashRotation = rotation;
        }
    }

    static arrowFlash() {
        const arrowPart2 = document.querySelector('.arrow-part2');
        if (!arrowPart2) return;

        gsap.timeline()
            .set(arrowPart2, {
                filter: 'brightness(3) saturate(2)'
            })
            .set(arrowPart2, {
                filter: 'brightness(1) saturate(1)',
                delay: 0.1
            });
    }

    static arrowCelebrationFlash() {
        const arrowPart2 = document.querySelector('.arrow-part2');
        if (!arrowPart2) return;

        // High frequency celebration flash sequence with partial fade
        gsap.timeline()
            // Flash 1
            .to(arrowPart2, {
                filter: 'brightness(5) saturate(3) drop-shadow(0 0 30px gold)',
                scale: 1.2,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1.9) saturate(1.6) drop-shadow(0 0 8px gold)',
                scale: 1.05,
                duration: 0.07,
                ease: 'power2.inOut'
            })
            // Flash 2
            .to(arrowPart2, {
                filter: 'brightness(4.8) saturate(2.8) drop-shadow(0 0 28px gold)',
                scale: 1.18,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1.8) saturate(1.5) drop-shadow(0 0 7px gold)',
                scale: 1.04,
                duration: 0.07,
                ease: 'power2.inOut'
            })
            // Flash 3
            .to(arrowPart2, {
                filter: 'brightness(6) saturate(3) drop-shadow(0 0 35px gold)',
                scale: 1.25,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1.7) saturate(1.4) drop-shadow(0 0 6px gold)',
                scale: 1.03,
                duration: 0.08,
                ease: 'power2.inOut'
            })
            // Flash 4
            .to(arrowPart2, {
                filter: 'brightness(4.5) saturate(2.5) drop-shadow(0 0 25px gold)',
                scale: 1.15,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1.6) saturate(1.3) drop-shadow(0 0 5px gold)',
                scale: 1.02,
                duration: 0.08,
                ease: 'power2.inOut'
            })
            // Flash 5
            .to(arrowPart2, {
                filter: 'brightness(4) saturate(2.3) drop-shadow(0 0 22px gold)',
                scale: 1.12,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1.5) saturate(1.25) drop-shadow(0 0 4px gold)',
                scale: 1.01,
                duration: 0.09,
                ease: 'power2.inOut'
            })
            // Flash 6
            .to(arrowPart2, {
                filter: 'brightness(3.5) saturate(2) drop-shadow(0 0 20px gold)',
                scale: 1.1,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1.4) saturate(1.2) drop-shadow(0 0 4px gold)',
                scale: 1.0,
                duration: 0.1,
                ease: 'power2.inOut'
            })
            // Flash 7
            .to(arrowPart2, {
                filter: 'brightness(3) saturate(1.8) drop-shadow(0 0 18px gold)',
                scale: 1.08,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1.3) saturate(1.15) drop-shadow(0 0 3px gold)',
                scale: 1.0,
                duration: 0.12,
                ease: 'power2.inOut'
            })
            // Flash 8
            .to(arrowPart2, {
                filter: 'brightness(2.5) saturate(1.6) drop-shadow(0 0 15px gold)',
                scale: 1.06,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1.2) saturate(1.1) drop-shadow(0 0 2px gold)',
                scale: 1.0,
                duration: 0.15,
                ease: 'power2.inOut'
            })
            // Flash 9
            .to(arrowPart2, {
                filter: 'brightness(2) saturate(1.4) drop-shadow(0 0 12px gold)',
                scale: 1.04,
                duration: 0.05,
                ease: 'power2.out'
            })
            .to(arrowPart2, {
                filter: 'brightness(1) saturate(1) drop-shadow(0 0 0px transparent)',
                scale: 1.0,
                duration: 0.6,
                ease: 'power2.out'
            });
    }

    static showPart4() {
        const part4 = document.querySelector('.wheel-part4');
        if (part4) {
            part4.classList.add('show');
        }
    }
}