// HTML template for wheel variant
export function generateWheelHTML(isDevelopment) {
  return `
  <div class="bg-container">
    <div class="main-container">
      <div class="logo1">
        <img src="./assets/images/logo1-part1.png" alt="Logo 1 Part 1" class="logo1-part1">
        <img src="./assets/images/logo1-part2.png" alt="Logo 1 Part 2" class="logo1-part2">
      </div>
      <div class="title-desktop"></div>
      <div class="title-mobile"></div>
      
      <div class="wheel-container">
        <div class="wheel-wrapper">
          <div class="wheel-part1"></div>
          <div class="wheel-part2"></div>
          <div class="wheel-part3"></div>
          <div class="wheel-text1"></div>
          <div class="wheel-text2"></div>
        </div>
        <div class="wheel-part4"></div>
        <div class="wheel-center-button">
          <div class="wheel-part5"></div>
          <div class="wheel-part6"></div>
        </div>
        <div class="arrow">
          <img src="./assets/images/arrow-part1.png" alt="Arrow Part 1" class="arrow-part1">
          <img src="./assets/images/arrow-part2.png" alt="Arrow Part 2" class="arrow-part2">
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
      <h4>Game Type</h4>
      <div class="mode-switcher">
        <span class="mode-label">Cards</span>
        <label class="switch">
          <input type="checkbox" id="gameTypeSwitcher">
          <span class="slider"></span>
        </label>
        <span class="mode-label">Wheel</span>
      </div>
    </div>
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