import { images } from './images-loader.js';

// Preloader for all game images
export class ImagePreloader {
  constructor() {
    this.loadedImages = 0;
    this.totalImages = 0;
    this.loadingPromises = [];
    this.onProgress = null;
  }

  // Set progress callback
  setProgressCallback(callback) {
    this.onProgress = callback;
  }

  // Preload single image
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.loadedImages++;
        if (this.onProgress) {
          const progress = Math.round((this.loadedImages / this.totalImages) * 100);
          this.onProgress(progress, this.loadedImages, this.totalImages);
        }
        console.log(`Loaded: ${src} (${this.loadedImages}/${this.totalImages})`);
        resolve(img);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        this.loadedImages++;
        if (this.onProgress) {
          const progress = Math.round((this.loadedImages / this.totalImages) * 100);
          this.onProgress(progress, this.loadedImages, this.totalImages);
        }
        resolve(null); // Resolve with null instead of rejecting to continue loading other images
      };
      
      img.src = src;
    });
  }

  // Preload all images
  async loadAllImages() {
    // Get all image URLs from the images object
    const imageUrls = Object.values(images).filter(url => url && typeof url === 'string');
    
    // Also include CSS background images
    const cssImages = [
      './assets/images/bg-main.png',
      './assets/images/bg-mobile.png',
      './assets/images/title.png',
      './assets/images/title-mobile.png'
    ];
    
    const allImages = [...imageUrls, ...cssImages];
    this.totalImages = allImages.length;
    this.loadedImages = 0;

    console.log(`Starting preload of ${this.totalImages} images...`);

    // Create loading promises for all images
    this.loadingPromises = allImages.map(src => this.loadImage(src));
    
    // Wait for all images to load (or fail)
    const results = await Promise.all(this.loadingPromises);
    
    console.log(`Preloading complete: ${this.loadedImages}/${this.totalImages} images processed`);
    
    return results;
  }

  // Get loading progress (0-100)
  getProgress() {
    if (this.totalImages === 0) return 0;
    return Math.round((this.loadedImages / this.totalImages) * 100);
  }
}