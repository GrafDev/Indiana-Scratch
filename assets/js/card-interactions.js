import { ImageEraser } from './eraser-effect.js';
import { showModal } from './modal-animations.js';

// Card interaction handler
export class CardInteractions {
  constructor() {
    this.erasers = new Map();
    this.clickCount = 0;
    this.cardImages = ['first-cart.png', 'second-cart.png', 'third-cart.png'];
    this.init();
  }
  
  init() {
    this.setupCardClickHandlers();
  }
  
  setupCardClickHandlers() {
    const cardBlocks = document.querySelectorAll('.card-block');
    
    cardBlocks.forEach(cardBlock => {
      cardBlock.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleCardClick(cardBlock);
      });
      
      cardBlock.style.cursor = 'pointer';
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
      console.log('Card already processed');
      return;
    }
    
    // Change the underlying image before creating canvas
    const imageIndex = this.clickCount % this.cardImages.length;
    firstImage.src = `assets/images/${this.cardImages[imageIndex]}`;
    this.clickCount++;
    
    // Create and start eraser
    const eraser = new ImageEraser(blanketImage, {
      eraserSize: 15
    });
    
    this.erasers.set(cardBlock, eraser);
    
    // Auto erase 70% with fast animation
    eraser.autoErase(70, 1000).then(percentage => {
      console.log(`Card erased: ${percentage.toFixed(1)}%`);
      console.log(`Click count: ${this.clickCount}`);
      this.onCardRevealed(cardBlock, percentage);
      
      // Show modal after third card
      if (this.clickCount === 3) {
        console.log('Third card clicked, showing modal in 500ms');
        setTimeout(() => {
          showModal();
        }, 500);
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