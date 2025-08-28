export const gameConfig = {
  // Base wheel size coefficient (300px base)
  baseWheelSize: 300,
  
  // Wheel spinning configuration (Visit Wheel style - 6 sectors)
  spinning: {
    // Array of target sectors (1-6) for each spin
    targetSectors: [1, 6],
    currentSpinIndex: 0,
    sectorAngle: 360 / 6, // degrees per sector (6 sectors total)
    baseDuration: 3, // base animation duration in seconds
    minRotations: 3, // minimum number of full rotations
    maxRotations: 5, // maximum number of full rotations
    currentSector: 1, // current sector position (starts at 1)
    isSpinning: false // flag to prevent multiple spins
  },
  
  // Auto mode configuration
  autoMode: {
    autoSpinDelay: 500 // delay before auto spin in ms
  },
  
  // Responsive breakpoints and multipliers
  responsive: {
    mobile: {
      maxWidth: 768,
      wheelMultiplier: 0.7,  // 70% of base size for mobile
    },
    tablet: {
      maxWidth: 1024,
      wheelMultiplier: 0.7, // 70% of base size for tablet
    },
    desktop: {
      wheelMultiplier: 0.8,  // 80% base size for desktop
    }
  },
  
  // Element size ratios relative to wheel size
  elements: {
    logo1: {
      widthRatio: 0.7,   // 70% of wheel size (увеличено в 2 раза)
      heightRatio: 0.35,  // 35% of wheel size (оставляем исходную высоту)
    },
    logo2: {
      widthRatio: 0.35,   // 35% of wheel size
      heightRatio: 0.35,  // 35% of wheel size
    },
    man: {
      widthRatio: 0.35,   // 35% of wheel size  
      heightRatio: 0.5,   // 50% of wheel size
    },
    manMobile: {
      widthRatio: 0.675,  // 67.5% of wheel size for mobile (45% * 1.5)
      heightRatio: 0.9,   // 90% of wheel size for mobile (60% * 1.5)
    },
    title: {
      widthRatio: 0.8,    // 80% of wheel size
      heightRatio: 0.15,  // 15% of wheel size
    },
    wheel: {
      widthRatio: 1.0,    // 100% of wheel size
      heightRatio: 1.0,   // 100% of wheel size
    },
    arrow: {
      widthRatio: 0.14,   // 14% of wheel size 
      heightRatio: 0.21,  // 21% of wheel size
    },
    arrowMobile: {
      widthRatio: 0.16,   // 16% of wheel size for mobile portrait
      heightRatio: 0.24,  // 24% of wheel size for mobile portrait
    },
    arrowLandscape: {
      widthRatio: 0.13,   // 13% of wheel size for mobile landscape
      heightRatio: 0.195, // 19.5% of wheel size for mobile landscape
    },
    wheelPart4: {
      widthRatio: 0.95,   // 95% of wheel size
      heightRatio: 0.95,  // 95% of wheel size
    }
  }
};

// Calculate current wheel size based on screen dimensions
export function calculateWheelSize() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const aspectRatio = screenWidth / screenHeight;
  
  let availableSpace;
  
  if (aspectRatio < 0.6) {
    // Mobile portrait: 80% of screen width
    availableSpace = screenWidth * 0.8;
  } else {
    // Tablet/Desktop: 90% of smaller dimension
    availableSpace = Math.min(screenWidth, screenHeight) * 0.9;
    
    if (aspectRatio >= 0.6 && aspectRatio < 1.3) {
      // Tablet: reduce to 75%
      availableSpace = availableSpace * 0.75;
    } else if (aspectRatio >= 1.3) {
      // Desktop: reduce to 80%
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

// Calculate rotation angle to reach target sector (Visit Wheel style)
export function calculateRotationAngle(targetSector, currentTotalRotation = 0) {
  const config = gameConfig.spinning;
  
  // Calculate target angle for sector (1-6 becomes 0-5, then * 60)
  const targetRotation = (targetSector - 1) * config.sectorAngle;
  
  // Random number of FULL rotations between min and max
  const randomFullRotations = Math.floor(Math.random() * (config.maxRotations - config.minRotations + 1)) + config.minRotations;
  const fullRotations = randomFullRotations * 360;
  
  // Calculate final angle: current total rotation + full rotations + target angle
  const finalAngle = currentTotalRotation + fullRotations + targetRotation;
  
  return finalAngle;
}

// Get next target sector and increment index
export function getNextTargetSector() {
  const config = gameConfig.spinning;
  if (config.currentSpinIndex >= config.targetSectors.length) {
    return null; // No more spins available
  }
  
  const targetSector = config.targetSectors[config.currentSpinIndex];
  config.currentSpinIndex++;
  
  return targetSector;
}