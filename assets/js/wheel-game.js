import { WheelAnimations } from './wheel-animations.js';
import { showModal } from './modal-animations.js';
import { gsap } from 'gsap';

// Wheel game logic based on Visit Wheel structure
export class WheelGame {
    constructor() {
        this.gameMode = import.meta.env.VITE_GAME_MODE || 'click';
        this.spinCount = 0;
        this.currentRotation = 0;
        this.isSpinning = false;
        this.modalShown = false;
        
        // Target rotations for spins
        this.targetRotations = [225, 180]; // First spin to 225°, second to 180°
        
        this.wheelWrapper = document.querySelector('.wheel-wrapper');
        this.part4 = document.querySelector('.wheel-part4');
        this.part5 = document.querySelector('.wheel-part5');
        this.part6 = document.querySelector('.wheel-part6');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeEntranceAnimations();
        
        // Auto mode - start spinning automatically after animations complete
        if (this.gameMode === 'auto') {
            setTimeout(() => {
                this.spin();
            }, 3000); // 3 second delay after entrance animations
        }
    }

    initializeEntranceAnimations() {
        // Run entrance animations
        const entranceTimeline = WheelAnimations.entranceAnimations();
        
        entranceTimeline.call(() => {
            // Start breathing animation for buttons after entrance
            this.startButtonBreathing();
        }, [], 1.5);
    }

    setupEventListeners() {
        // Click handlers for part5 and part6 (spin buttons)
        [this.part5, this.part6].forEach(element => {
            if (element) {
                element.style.cursor = 'pointer';
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.spin();
                });
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            }
        });
    }

    startButtonBreathing() {
        if (!this.part5 || !this.part6 || this.isSpinning) return;
        
        // Живая анимация дыхания для кнопки
        this.breathingAnimation = gsap.timeline({ repeat: -1 })
            .to([this.part5, this.part6], {
                scale: 0.92,
                rotate: -2,
                duration: 0.8,
                ease: 'sine.inOut'
            })
            .to([this.part5, this.part6], {
                scale: 1.08,
                rotate: 2,
                duration: 0.9,
                ease: 'sine.inOut'
            })
            .to([this.part5, this.part6], {
                scale: 0.96,
                rotate: -1,
                duration: 0.7,
                ease: 'sine.inOut'
            })
            .to([this.part5, this.part6], {
                scale: 1.04,
                rotate: 1,
                duration: 0.8,
                ease: 'sine.inOut'
            });
    }

    stopButtonBreathing() {
        if (this.breathingAnimation) {
            this.breathingAnimation.kill();
            this.breathingAnimation = null;
        }
    }

    getTargetRotation() {
        if (this.spinCount >= this.targetRotations.length) {
            return null; // No more spins
        }
        return this.targetRotations[this.spinCount];
    }

    spin() {
        if (this.isSpinning) return;

        const targetRotation = this.getTargetRotation();
        if (targetRotation === null) {
            console.log('All spins completed!');
            return;
        }

        this.isSpinning = true;
        this.spinCount++;

        // Hide part4 when starting new spin
        if (this.part4) {
            this.part4.classList.remove('show');
        }

        // Stop breathing animation
        this.stopButtonBreathing();
        
        // Remove cursor pointer during spin
        if (this.part5) this.part5.style.cursor = 'default';
        if (this.part6) this.part6.style.cursor = 'default';

        // Button press animation
        const pressAnimation = WheelAnimations.buttonPress();
        
        if (pressAnimation) {
            pressAnimation.call(() => {
                // Start wheel spinning after button press
                this.spinWheel(targetRotation);
            }, [], 0.2);
        } else {
            this.spinWheel(targetRotation);
        }
    }

    async spinWheel(targetRotation) {
        try {
            // Spin the wheel
            this.currentRotation = await WheelAnimations.wheelSpin(this.currentRotation, targetRotation);
            
            // Handle spin completion
            setTimeout(() => {
                this.onSpinComplete();
            }, 1000);
            
        } catch (error) {
            console.error('Wheel spin error:', error);
            this.isSpinning = false;
        }
    }

    onSpinComplete() {
        this.isSpinning = false;

        // Show part4 with flicker animation when wheel stops
        if (this.part4) {
            this.part4.classList.add('show');
        }

        // Restore cursor pointer
        if (this.part5) this.part5.style.cursor = 'pointer';
        if (this.part6) this.part6.style.cursor = 'pointer';
        
        const maxSpins = this.gameMode === 'auto' ? 1 : 2;
        
        if (this.spinCount < maxSpins) {
            // More spins available - restart breathing
            this.startButtonBreathing();
            
            // Auto spin next if in auto mode
            if (this.gameMode === 'auto') {
                setTimeout(() => {
                    this.spin();
                }, 2500); // 2.5 second delay between auto spins
            }
        } else {
            // Game over - show modal after delay
            if (!this.modalShown) {
                this.modalShown = true;
                setTimeout(() => {
                    showModal();
                }, 3000); // 3 second pause before modal
            }
        }
    }

    reset() {
        this.spinCount = 0;
        this.currentRotation = 0;
        this.isSpinning = false;
        this.modalShown = false;
        
        // Hide part4 when resetting
        if (this.part4) {
            this.part4.classList.remove('show');
        }
        
        this.stopButtonBreathing();
        this.startButtonBreathing();
    }
}