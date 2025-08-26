// Eraser effect for PNG images
export class ImageEraser {
  constructor(imageElement, options = {}) {
    this.image = imageElement;
    this.canvas = null;
    this.ctx = null;
    this.lastStrokeEnd = null;
    
    // Default options
    this.options = {
      eraserSize: 20,
      eraserOpacity: 1.0,
      ...options
    };
    
    this.init();
  }
  
  init() {
    // Create canvas overlay
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size to match image
    this.canvas.width = this.image.naturalWidth || this.image.width;
    this.canvas.height = this.image.naturalHeight || this.image.height;
    
    // Style canvas to overlay image  
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '10';
    
    // Make image container relative
    this.image.parentElement.style.position = 'relative';
    
    // Draw image onto canvas
    this.drawImageOnCanvas();
    
    // Position canvas over image and hide original image
    this.image.parentElement.appendChild(this.canvas);
    this.image.style.opacity = '0';
    
    console.log('Canvas visible:', this.canvas.style.opacity !== '0');
    console.log('Canvas display:', this.canvas.style.display);
    
    console.log('Canvas created:', this.canvas.width, 'x', this.canvas.height);
    console.log('Image src:', this.image.src);
    
    // Add event listeners
    this.addEventListeners();
  }
  
  drawImageOnCanvas() {
    const img = new Image();
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
      console.log('Image drawn on canvas:', this.canvas.width, 'x', this.canvas.height);
    };
    img.onerror = () => {
      console.error('Failed to load image for canvas:', this.image.src);
    };
    img.src = this.image.src;
  }
  
  addEventListeners() {
    // Only pointer events disabled - automatic erasing only
    this.canvas.style.pointerEvents = 'none';
  }
  
  
  // Get erased percentage
  getErasedPercentage() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < pixels.length; i += 4) {
      const alpha = pixels[i + 3];
      if (alpha < 128) { // Consider semi-transparent as erased
        transparentPixels++;
      }
      totalPixels++;
    }
    
    const percentage = (transparentPixels / totalPixels) * 100;
    return percentage;
  }
  
  // Reset image
  reset() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawImageOnCanvas();
  }
  
  
  // Cloth wiping effect - connected strokes like cleaning dirty glass
  autoErase(targetPercentage = 70, duration = 1000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const totalStrokes = 5; // Fewer strokes
      let strokesCreated = 0;
      this.lastStrokeEnd = null;
      
      console.log(`Starting cloth wipe effect: ${totalStrokes} strokes over ${duration}ms`);
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        const targetStrokes = Math.floor(progress * totalStrokes);
        
        while (strokesCreated < targetStrokes && strokesCreated < totalStrokes) {
          this.createWipeStroke();
          strokesCreated++;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.ctx.globalCompositeOperation = 'source-over';
          console.log(`Wipe complete: ${strokesCreated} strokes created`);
          resolve(targetPercentage);
        }
      };
      
      animate();
    });
  }
  
  // Create a sponge-like wipe stroke with irregular texture
  createWipeStroke() {
    // All strokes start from middle line (center Y)
    const canvasCenterY = this.canvas.height / 2;
    
    // Start from center area of middle line (1/2 width from center)
    const canvasCenterX = this.canvas.width / 2;
    const centerAreaWidth = this.canvas.width / 2; // Half of canvas width
    const centerX = canvasCenterX - centerAreaWidth/2 + Math.random() * centerAreaWidth;
    const centerY = canvasCenterY; // Always start from middle line
    
    // Stroke always goes from center line to edge
    const angle = Math.random() * Math.PI * 2;
    
    // Calculate maximum distance to canvas edge in this direction
    let maxDistance;
    if (angle >= 0 && angle < Math.PI / 2) {
      // Top-right quadrant
      maxDistance = Math.min((this.canvas.width - centerX) / Math.cos(angle), centerY / Math.sin(angle));
    } else if (angle >= Math.PI / 2 && angle < Math.PI) {
      // Top-left quadrant
      maxDistance = Math.min(centerX / Math.abs(Math.cos(angle)), centerY / Math.sin(angle));
    } else if (angle >= Math.PI && angle < 3 * Math.PI / 2) {
      // Bottom-left quadrant
      maxDistance = Math.min(centerX / Math.abs(Math.cos(angle)), (this.canvas.height - centerY) / Math.abs(Math.sin(angle)));
    } else {
      // Bottom-right quadrant
      maxDistance = Math.min((this.canvas.width - centerX) / Math.cos(angle), (this.canvas.height - centerY) / Math.abs(Math.sin(angle)));
    }
    
    const strokeLength = maxDistance + this.options.eraserSize * 6; // Center can go beyond edge
    const endX = centerX + Math.cos(angle) * strokeLength;
    const endY = centerY + Math.sin(angle) * strokeLength;
    
    
    this.ctx.globalCompositeOperation = 'destination-out';
    
    // Create irregular eraser brush along the stroke path
    const brushSteps = 25; // More stamps for bigger stroke coverage
    
    for (let step = 0; step <= brushSteps; step++) {
      const t = step / brushSteps; // Position along stroke from 0 to 1
      const baseX = centerX + Math.cos(angle) * strokeLength * t;
      const baseY = centerY + Math.sin(angle) * strokeLength * t;
      
      // Create irregular brush stamp at this position
      this.createIrregularBrush(baseX, baseY);
    }
  }
  
  // Create an irregular brush stamp with big center circle and small perimeter circles
  createIrregularBrush(x, y) {
    const mainRadius = this.options.eraserSize * 12; // Smaller main circle
    
    // Check bounds to ensure circles don't go outside canvas
    const margin = mainRadius + this.options.eraserSize * 0.8; // Safety margin
    if (x < margin || x > this.canvas.width - margin || 
        y < margin || y > this.canvas.height - margin) {
      return; // Skip if too close to edges
    }
    
    // Draw main center circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, mainRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add small circles around the perimeter
    const perimeterCircles = 25; // More circles
    
    for (let i = 0; i < perimeterCircles; i++) {
      const perimeterAngle = (i / perimeterCircles) * Math.PI * 2 + Math.random() * 0.2; // Slight randomness
      const perimeterDistance = mainRadius + this.options.eraserSize * (0.2 + Math.random() * 0.3);
      
      const smallX = x + Math.cos(perimeterAngle) * perimeterDistance;
      const smallY = y + Math.sin(perimeterAngle) * perimeterDistance;
      const smallRadius = this.options.eraserSize * (0.2 + Math.random() * 0.5); // Random sizes 0.2x to 0.7x
      
      // Check if small circle is within bounds
      if (smallX - smallRadius > 0 && smallX + smallRadius < this.canvas.width &&
          smallY - smallRadius > 0 && smallY + smallRadius < this.canvas.height) {
        this.ctx.beginPath();
        this.ctx.arc(smallX, smallY, smallRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
  
  // Auto erase with pattern (more controlled)
  autoErasePattern(targetPercentage = 70) {
    return new Promise((resolve) => {
      const width = this.canvas.width;
      const height = this.canvas.height;
      const totalPixels = width * height;
      const targetErasedPixels = (targetPercentage / 100) * totalPixels;
      
      let erasedPixels = 0;
      const eraserSize = this.options.eraserSize;
      
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.globalAlpha = 1.0;
      
      // Create random pattern
      while (erasedPixels < targetErasedPixels) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = eraserSize * (0.3 + Math.random() * 0.7);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        erasedPixels += Math.PI * size * size;
      }
      
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.globalAlpha = 1.0;
      
      const actualPercentage = this.getErasedPercentage();
      resolve(actualPercentage);
    });
  }
}

// Usage examples:
// const imageElement = document.querySelector('.card-blanket');
// const eraser = new ImageEraser(imageElement, { eraserSize: 30 });
// 
// Animated auto erase:
// eraser.autoErase(70, 3000).then(percentage => console.log(`Erased: ${percentage}%`));
// 
// Instant pattern erase:
// eraser.autoErasePattern(70).then(percentage => console.log(`Erased: ${percentage}%`));