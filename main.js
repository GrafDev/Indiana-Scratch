import './main.css'

let devMode = false;

document.querySelector('#app').innerHTML = `
  <div class="bg-container">
    <div class="main-wheel-container">
      <h1>Visit Wheel</h1>
      <div class="card">
        <p>
          Добро пожаловать в проект Visit Wheel!
        </p>
      </div>
      <p class="read-the-docs">
        Измените <code>main.js</code> и сохраните, чтобы увидеть обновления.
      </p>
    </div>
  </div>
  <div class="dev-panel" id="devPanel" style="display: none;">
    <label>
      <input type="checkbox" id="showBorders"> Показать рамки
    </label>
  </div>
  <button class="dev-toggle" id="devToggle">DEV</button>
`

const devToggle = document.getElementById('devToggle');
const devPanel = document.getElementById('devPanel');
const showBordersCheckbox = document.getElementById('showBorders');

devToggle.addEventListener('click', () => {
  devMode = !devMode;
  devPanel.style.display = devMode ? 'block' : 'none';
  devToggle.textContent = devMode ? 'HIDE DEV' : 'DEV';
});

showBordersCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.add('dev-borders');
  } else {
    document.body.classList.remove('dev-borders');
  }
});