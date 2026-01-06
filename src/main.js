import { Input } from './core/input.js';
import { Stage1 } from './stages/stage1/index.js';
import { Stage2 } from './stages/stage2/index.js';
import { Stage3 } from './stages/stage3/index.js';
import { Stage4 } from './stages/stage4/index.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const hudStage = document.getElementById('hud-stage');
const hudHealth = document.getElementById('hud-health');
const hudEnergy = document.getElementById('hud-energy');
const hudPoints = document.getElementById('hud-points');
const hudTrait = document.getElementById('hud-trait');
const stageDescription = document.getElementById('stage-description');
const stageSelect = document.getElementById('stage-select');
const restartBtn = document.getElementById('restart-stage');
const evoMenu = document.getElementById('evo-menu');
const toggleEvoBtn = document.getElementById('toggle-evo');
const closeEvoBtn = document.getElementById('close-evo');
const evoOptionsEl = document.getElementById('evo-options');

const input = new Input();
let activeStageKey = 'stage1';
let lastTime = 0;
let lastPointsRendered = null;

const stageMap = {
  stage1: new Stage1(canvas.width, canvas.height),
  stage2: new Stage2(canvas.width, canvas.height),
  stage3: new Stage3(canvas.width, canvas.height),
  stage4: new Stage4(canvas.width, canvas.height),
};

/**
 * Render evolution menu cards based on current stage options.
 */
function renderEvolutionMenu() {
  const stage = stageMap[activeStageKey];
  const options = stage.getEvolutionOptions?.() || [];
  evoOptionsEl.innerHTML = '';
  options.forEach((opt) => {
    const card = document.createElement('div');
    card.className = 'evo-card';
    const title = document.createElement('h3');
    title.textContent = opt.title;
    const desc = document.createElement('p');
    desc.textContent = opt.desc;
    const cost = document.createElement('p');
    cost.textContent = `Cost: ${opt.cost} pts`;
    const btn = document.createElement('button');
    btn.textContent = 'Evolve';
    btn.disabled = (stage.player?.evoPoints ?? 0) < opt.cost;
    btn.addEventListener('click', () => {
      if ((stage.player?.evoPoints ?? 0) >= opt.cost) {
        stage.player.evoPoints -= opt.cost;
        opt.apply();
        renderEvolutionMenu();
      }
    });

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(cost);
    card.appendChild(btn);
    evoOptionsEl.appendChild(card);
  });
  lastPointsRendered = stage.player?.evoPoints ?? 0;
}

function updateHUD() {
  const hud = stageMap[activeStageKey].getHUDData();
  hudStage.textContent = hud.stageLabel;
  hudHealth.textContent = hud.health;
  hudEnergy.textContent = hud.energy;
  hudPoints.textContent = hud.points;
  hudTrait.textContent = hud.trait;
  stageDescription.textContent = hud.description;
}

function maybeRefreshMenu() {
  const stage = stageMap[activeStageKey];
  const currentPoints = stage.player?.evoPoints ?? 0;
  if (!evoMenu.classList.contains('hidden') && currentPoints !== lastPointsRendered) {
    renderEvolutionMenu();
  }
}

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  const stage = stageMap[activeStageKey];
  stage.update?.(dt, input);
  stage.render?.(ctx);
  updateHUD();
  maybeRefreshMenu();
  requestAnimationFrame(gameLoop);
}

function setStage(key) {
  activeStageKey = key;
  stageMap[activeStageKey].reset?.();
  renderEvolutionMenu();
  updateHUD();
}

function toggleMenu(open) {
  const shouldOpen = typeof open === 'boolean' ? open : evoMenu.classList.contains('hidden');
  evoMenu.classList.toggle('hidden', !shouldOpen);
  if (!evoMenu.classList.contains('hidden')) {
    renderEvolutionMenu();
  }
}

// Wiring UI
stageSelect.addEventListener('change', (e) => setStage(e.target.value));
restartBtn.addEventListener('click', () => stageMap[activeStageKey].reset?.());
toggleEvoBtn.addEventListener('click', () => toggleMenu(true));
closeEvoBtn.addEventListener('click', () => toggleMenu(false));
input.on('toggle-menu', () => toggleMenu());
evoMenu.addEventListener('click', (e) => {
  if (e.target === evoMenu) toggleMenu(false);
});

toggleMenu(false);
renderEvolutionMenu();
requestAnimationFrame((t) => {
  lastTime = t;
  requestAnimationFrame(gameLoop);
});

// How-to-run helper for console explorers
console.info('Run a simple static server (e.g., python -m http.server 8000) and open http://localhost:8000');
