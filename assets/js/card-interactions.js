import { ImageEraser } from './eraser-effect.js';
import { showModal } from './modal-animations.js';
import { images } from './images-loader.js';

// Card interaction handler
export class CardInteractions {
  constructor() {
    this.erasers = new Map();
    this.clickCount = 0;
    this.cardImages = [images.firstCart, images.secondCart, images.thirdCart];
    this.modalShown = false; // Флаг чтобы показать модалку только один раз
    this.init();
  }
  
  init() {
    this.setupCardClickHandlers();
  }
  
  setupCardClickHandlers() {
    const cardBlocks = document.querySelectorAll('.card-block');
    
    cardBlocks.forEach(cardBlock => {
      // Handle both click and touch events
      const handleEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleCardClick(cardBlock);
      };
      
      cardBlock.addEventListener('click', handleEvent);
      cardBlock.addEventListener('touchend', handleEvent);
      
      cardBlock.style.cursor = 'pointer';
      cardBlock.style.touchAction = 'manipulation'; // Better touch response
    });
  }
  
  handleCardClick(cardBlock) {
    const blanketImage = cardBlock.querySelector('.card-blanket');
    const firstImage = cardBlock.querySelector('.card-first');
    
    if (!blanketImage || !firstImage) {
      console.warn('Card images not found');
      return;
    }
    
    // Check if already erased
    if (this.erasers.has(cardBlock)) {
      return;
    }
    
    // Change the underlying image and show with fade
    const imageIndex = this.clickCount % this.cardImages.length;
    firstImage.src = this.cardImages[imageIndex];
    
    // Show first card with fade effect
    setTimeout(() => {
      firstImage.style.opacity = '1';
    }, 100);
    
    this.clickCount++;
    
    // Create and start eraser
    const eraser = new ImageEraser(blanketImage, {
      eraserSize: 15
    });
    
    this.erasers.set(cardBlock, eraser);
    
    // Auto erase 70% with fast animation
    eraser.autoErase(70, 1000).then(percentage => {
      this.onCardRevealed(cardBlock, percentage);
      
      // Show modal after third card
      if (this.clickCount === 3 && !this.modalShown) {
        this.modalShown = true;
        setTimeout(() => {
          showModal();
        }, 2000);
      }
    });
    
    // Add visual feedback
    cardBlock.classList.add('card-processing');
  }
  
  onCardRevealed(cardBlock, percentage) {
    // Remove processing state
    cardBlock.classList.remove('card-processing');
    
    // Add revealed state
    cardBlock.classList.add('card-revealed');
    
    // Disable further clicks
    cardBlock.style.cursor = 'default';
    cardBlock.style.pointerEvents = 'none';
    
    // Custom event for game logic
    const event = new CustomEvent('cardRevealed', {
      detail: {
        cardBlock,
        percentage
      }
    });
    document.dispatchEvent(event);
  }
  
  // Reset all cards
  resetAllCards() {
    this.erasers.forEach((eraser, cardBlock) => {
      eraser.reset();
      cardBlock.classList.remove('card-processing', 'card-revealed');
      cardBlock.style.cursor = 'pointer';
      cardBlock.style.pointerEvents = 'auto';
    });
    this.erasers.clear();
  }
  
  // Get revealed cards count
  getRevealedCardsCount() {
    return document.querySelectorAll('.card-block.card-revealed').length;
  }
  
}