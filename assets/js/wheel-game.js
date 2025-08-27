import { WheelAnimations } from './wheel-animations.js';
import { showModal } from './modal-animations.js';
import { gsap } from 'gsap';

// Wheel game logic for Indiana Scratch wheel variant
export class WheelGame {
    constructor() {
        this.gameMode = import.meta.env.VITE_GAME_MODE || 'click';
        this.spinCount = 0;
        this.isSpinning = false;
        this.buttonBlocked = false;
        this.modalShown = false;
        
        this.wheelElement = document.querySelector('.wheel-image');
        this.spinButton = document.querySelector('.spin-button');
        this.counterElement = document.querySelector('.counter-text');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCounter();
        
        // Initial wheel setup
        if (this.wheelElement) {
            WheelAnimations.wheelSpin(this.wheelElement, 0, 0).then(() => {
                if (this.spinButton) {
                    WheelAnimations.buttonGlow(this.spinButton);
                    this.startButtonShake();
                }
            });
        }

        // Auto mode - start spinning automatically after delay
        if (this.gameMode === 'auto') {
            setTimeout(() => {
                this.spin();
            }, 2000); // 2 second delay
        }
    }

    setupEventListeners() {
        if (this.spinButton) {
            this.spinButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.spin();
            });
        }

        // Click anywhere to spin (except modal)
        document.addEventListener('click', (e) => {
            if (!this.buttonBlocked && 
                !e.target.closest('.modal-overlay') && 
                !e.target.closest('.spin-button')) {
                this.spin();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && !this.buttonBlocked) {
                e.preventDefault();
                this.spin();
            }
        });
    }

    startButtonShake() {
        if (this.spinButton && !this.isSpinning && !this.buttonBlocked) {
            this.spinButton.classList.add('shaking');
        }
    }

    stopButtonShake() {
        if (this.spinButton) {
            this.spinButton.classList.remove('shaking');
        }
    }

    updateCounter() {
        if (this.counterElement) {
            const maxSpins = this.gameMode === 'auto' ? 1 : 2;
            const remaining = Math.max(0, maxSpins - this.spinCount);
            this.counterElement.textContent = remaining;
        }
    }

    spin() {
        if (this.isSpinning || this.buttonBlocked) return;

        this.isSpinning = true;
        this.buttonBlocked = true;
        this.spinCount++;

        this.updateCounter();
        this.stopButtonShake();

        if (this.spinButton) {
            WheelAnimations.stopButtonGlow(this.spinButton);
            // Button press effect
            gsap.to(this.spinButton, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }

        // Get current rotation
        const currentRotation = gsap.getProperty(this.wheelElement, "rotation") || 0;
        
        // Spin the wheel
        WheelAnimations.wheelSpin(this.wheelElement, currentRotation, this.spinCount, this.gameMode)
            .then(() => {
                this.onSpinComplete();
            });
    }

    onSpinComplete() {
        this.isSpinning = false;

        const maxSpins = this.gameMode === 'auto' ? 1 : 2;
        
        if (this.spinCount < maxSpins) {
            // More spins available
            this.buttonBlocked = false;
            if (this.spinButton) {
                WheelAnimations.buttonGlow(this.spinButton);
                this.startButtonShake();
            }
        } else {
            // Game over - show modal after delay
            if (!this.modalShown) {
                this.modalShown = true;
                setTimeout(() => {
                    showModal();
                }, 2000); // 2 second pause before modal
            }
        }
    }

    reset() {
        this.spinCount = 0;
        this.isSpinning = false;
        this.buttonBlocked = false;
        this.modalShown = false;
        this.updateCounter();
        
        if (this.spinButton) {
            WheelAnimations.buttonGlow(this.spinButton);
            this.startButtonShake();
        }
    }
}