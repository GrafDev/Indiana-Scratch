// HTML template for wheel variant
export function generateWheelHTML(isDevelopment) {
  return `
  <div class="bg-container">
    <div class="main-container">
      <div class="logo1">
        <img src="./assets/images/logo1-part1.png" alt="Logo 1 Part 1" class="logo1-part1">
        <img src="./assets/images/logo1-part2.png" alt="Logo 1 Part 2" class="logo1-part2">
      </div>
      <div class="title"></div>
      
      <div class="wheel-container">
        <div class="wheel-section">
          <img src="./assets/images/wheel.png" alt="Wheel" class="wheel-image">
          <div class="wheel-arrow">
            <img src="./assets/images/arrow.png" alt="Arrow" class="arrow-image">
          </div>
        </div>
        
        <div class="spin-button-container">
          <img src="./assets/images/button-spin.png" alt="Spin Button" class="spin-button">
        </div>
        
        <div class="counter-container">
          <img src="./assets/images/counter.png" alt="Counter" class="counter-bg">
          <span class="counter-text">2</span>
        </div>
      </div>
    </div>
    
    <div class="media-container">
      <div class="box1">
        <div class="box-man1">
          <img src="./assets/images/man1-part1.png" alt="Man 1 Part 1" class="man1-part1">
          <img src="./assets/images/man1-part2.png" alt="Man 1 Part 2" class="man1-part2">
        </div>
      </div>
      <div class="box2">
        <div class="box-man2">
          <img src="./assets/images/man2-part1.png" alt="Man 2 Part 1" class="man2-part1">
          <img src="./assets/images/man2-part2.png" alt="Man 2 Part 2" class="man2-part2">
        </div>
      </div>
    </div>
  </div>
  ${isDevelopment ? `
  <div class="dev-panel" id="devPanel" style="display: none;">
    <div class="dev-section">
      <h4>Game Mode</h4>
      <div class="mode-switcher">
        <span class="mode-label">Click</span>
        <label class="switch">
          <input type="checkbox" id="modeSwitcher">
          <span class="slider"></span>
        </label>
        <span class="mode-label">Auto</span>
      </div>
    </div>
    <div class="dev-section">
      <h4>Debug</h4>
      <label>
        <input type="checkbox" id="showBorders"> Показать рамки
      </label>
    </div>
  </div>
  <button class="dev-toggle" id="devToggle">DEV</button>
  ` : ''}
`;
}