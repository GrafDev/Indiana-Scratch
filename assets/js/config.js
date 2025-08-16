export const gameConfig = {
  // Base wheel size coefficient (300px base)
  baseWheelSize: 300,
  
  // Responsive breakpoints and multipliers
  responsive: {
    mobile: {
      maxWidth: 768,
      wheelMultiplier: 0.7,  // 70% of base size for mobile
    },
    tablet: {
      maxWidth: 1024,
      wheelMultiplier: 0.85, // 85% of base size for tablet
    },
    desktop: {
      wheelMultiplier: 1.0,  // 100% base size for desktop
    }
  },
  
  // Element size ratios relative to wheel size
  elements: {
    logo1: {
      widthRatio: 0.35,   // 35% of wheel size
      heightRatio: 0.35,  // 35% of wheel size
    },
    logo2: {
      widthRatio: 0.35,   // 35% of wheel size
      heightRatio: 0.35,  // 35% of wheel size
    },
    man: {
      widthRatio: 0.35,   // 35% of wheel size  
      heightRatio: 0.5,   // 50% of wheel size
    },
    title: {
      widthRatio: 0.8,    // 80% of wheel size
      heightRatio: 0.15,  // 15% of wheel size
    },
    wheel: {
      widthRatio: 1.0,    // 100% of wheel size
      heightRatio: 1.0,   // 100% of wheel size
    }
  }
};

// Calculate current wheel size based on screen dimensions
export function calculateWheelSize() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Use smaller dimension and take different percentage based on device
  let availableSpace;
  
  if (screenWidth <= gameConfig.responsive.mobile.maxWidth) {
    // Mobile: 80% of smaller dimension
    availableSpace = Math.min(screenWidth, screenHeight) * 0.8;
  } else {
    // Tablet/Desktop: 90% of smaller dimension
    availableSpace = Math.min(screenWidth, screenHeight) * 0.9;
  }
  
  // Apply size reduction for non-mobile devices
  if (screenWidth > gameConfig.responsive.mobile.maxWidth) {
    // Reduce wheel size for tablet and desktop
    if (screenWidth <= gameConfig.responsive.tablet.maxWidth) {
      // Tablet: reduce to 90% of calculated size
      availableSpace = availableSpace * 0.9;
    } else {
      // Desktop: reduce to 80% of calculated size
      availableSpace = availableSpace * 0.8;
    }
  }
  
  return Math.round(availableSpace);
}

// Get element dimensions based on wheel size
export function getElementSize(elementType) {
  const wheelSize = calculateWheelSize();
  const elementConfig = gameConfig.elements[elementType];
  
  if (!elementConfig) {
    console.warn(`Unknown element type: ${elementType}`);
    return { width: wheelSize * 0.2, height: wheelSize * 0.2 };
  }
  
  return {
    width: Math.round(wheelSize * elementConfig.widthRatio),
    height: Math.round(wheelSize * elementConfig.heightRatio)
  };
}