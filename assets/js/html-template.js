import { images } from './images-loader.js';

// HTML template generation
export function generateHTML(isDevelopment) {
  return `
  <div class="bg-container">
    <div class="main-container">
      <div class="logo1">
        <img src="${images.logo1Part1}" alt="Logo 1 Part 1" class="logo1-part1">
        <img src="${images.logo1Part2}" alt="Logo 1 Part 2" class="logo1-part2">
      </div>
      <div class="title"></div>
      <div class="cards-container">
          <div class="cards-top-row">
            <div class="card-block">
              <img src="${images.bgCart}" alt="Card Background" class="card-bg">
              <img src="${images.firstCart}" alt="First Card" class="card-first">
              <img src="${images.blanketCart}" alt="Blanket Card" class="card-blanket">
              <img src="${images.borderCart}" alt="Card Border" class="card-border">
            </div>
            <div class="card-block">
              <img src="${images.bgCart}" alt="Card Background" class="card-bg">
              <img src="${images.firstCart}" alt="First Card" class="card-first">
              <img src="${images.blanketCart}" alt="Blanket Card" class="card-blanket">
              <img src="${images.borderCart}" alt="Card Border" class="card-border">
            </div>
          </div>
          <div class="card-block">
            <img src="${images.bgCart}" alt="Card Background" class="card-bg">
            <img src="${images.firstCart}" alt="First Card" class="card-first">
            <img src="${images.blanketCart}" alt="Blanket Card" class="card-blanket">
            <img src="${images.borderCart}" alt="Card Border" class="card-border">
          </div>
        </div>
    </div>
    <div class="media-container">
      <div class="box1">
        <div class="box-man1">
          <img src="${images.man1Part1}" alt="Man 1 Part 1" class="man1-part1">
          <img src="${images.man1Part2}" alt="Man 1 Part 2" class="man1-part2">
        </div>
      </div>
      <div class="box2">
        <div class="box-man2">
          <img src="${images.man2Part1}" alt="Man 2 Part 1" class="man2-part1">
          <img src="${images.man2Part2}" alt="Man 2 Part 2" class="man2-part2">
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