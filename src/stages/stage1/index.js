import { clamp, distance, randomInArea } from '../../core/utils.js';
import { evolutionTree } from '../../config/evolutionTree.js';

/**
 * Stage 1: single-cell playground.
 * Focuses on movement, sensing radius, food collection, and basic hazards.
 */
export class Stage1 {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
  }

  reset() {
    this.player = {
      x: this.width / 2,
      y: this.height / 2,
      radius: 14,
      speed: 120,
      perception: 120,
      maxHealth: 80,
      health: 80,
      energy: 40,
      evoPoints: 0,
      color: '#68a8ff',
    };
    this.food = [];
    this.hazards = [];
    this.spawnTimer = 0;
    this.hazardTimer = 0;
    this.stageName = 'Stage 1 – Single Cell';
  }

  /** Create evolution options specific to this stage. */
  getEvolutionOptions() {
    return [
      {
        id: 'speed',
        title: 'Flagella (Speed)',
        desc: 'Boost thrust to swim faster.',
        cost: evolutionTree.stage1.speed.cost,
        apply: () => {
          this.player.speed += evolutionTree.stage1.speed.delta;
        },
      },
      {
        id: 'perception',
        title: 'Sensory Hairs (Perception)',
        desc: 'Sense food from farther away.',
        cost: evolutionTree.stage1.perception.cost,
        apply: () => {
          this.player.perception += evolutionTree.stage1.perception.delta;
        },
      },
      {
        id: 'health',
        title: 'Thicker Membrane (Health)',
        desc: 'Increase max health and stability.',
        cost: evolutionTree.stage1.health.cost,
        apply: () => {
          this.player.maxHealth += evolutionTree.stage1.health.delta;
          this.player.health += evolutionTree.stage1.health.delta;
          this.player.radius += 1.5;
        },
      },
    ];
  }

  /**
   * Update simulation for the frame.
   * @param {number} dt delta time in seconds
   * @param {Input} input input handler
   */
  update(dt, input) {
    const p = this.player;
    // Movement handling
    let vx = 0;
    let vy = 0;
    if (input.isDown('w') || input.isDown('arrowup')) vy -= 1;
    if (input.isDown('s') || input.isDown('arrowdown')) vy += 1;
    if (input.isDown('a') || input.isDown('arrowleft')) vx -= 1;
    if (input.isDown('d') || input.isDown('arrowright')) vx += 1;
    const length = Math.hypot(vx, vy) || 1;
    p.x += (vx / length) * p.speed * dt;
    p.y += (vy / length) * p.speed * dt;
    p.x = clamp(p.x, p.radius, this.width - p.radius);
    p.y = clamp(p.y, p.radius, this.height - p.radius);

    // Slow energy drain, passive regen.
    p.energy = clamp(p.energy - dt * 3, 0, 100);
    if (p.energy <= 0) {
      p.health = clamp(p.health - dt * 5, 0, p.maxHealth);
    }

    // Spawn food and hazards periodically.
    this.spawnTimer += dt;
    if (this.spawnTimer > 0.6 && this.food.length < 40) {
      this.spawnTimer = 0;
      this.food.push({ ...randomInArea(this.width, this.height, 18), radius: 6 });
    }

    this.hazardTimer += dt;
    if (this.hazardTimer > 3 && this.hazards.length < 6) {
      this.hazardTimer = 0;
      const pos = randomInArea(this.width, this.height, 40);
      this.hazards.push({ ...pos, radius: 18, vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 40 });
    }

    // Move hazards
    this.hazards.forEach((h) => {
      h.x += h.vx * dt;
      h.y += h.vy * dt;
      if (h.x < h.radius || h.x > this.width - h.radius) h.vx *= -1;
      if (h.y < h.radius || h.y > this.height - h.radius) h.vy *= -1;
    });

    // Food collection
    this.food = this.food.filter((f) => {
      if (distance(p, f) < p.radius + f.radius) {
        p.energy = clamp(p.energy + 10, 0, 120);
        p.evoPoints += 1;
        return false;
      }
      return true;
    });

    // Hazard collisions
    this.hazards.forEach((h) => {
      if (distance(p, h) < p.radius + h.radius) {
        p.health = clamp(p.health - dt * 15, 0, p.maxHealth);
      }
    });

    // Soft fail -> reposition
    if (p.health <= 0) {
      this.reset();
    }
  }

  /** Render organisms, food, and HUD circles. */
  render(ctx) {
    const p = this.player;
    ctx.clearRect(0, 0, this.width, this.height);

    // Vision radius
    ctx.fillStyle = 'rgba(108, 242, 197, 0.07)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.perception, 0, Math.PI * 2);
    ctx.fill();

    // Food
    ctx.fillStyle = '#6cf2c5';
    this.food.forEach((f) => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Hazards
    ctx.fillStyle = '#f15b6c';
    this.hazards.forEach((h) => {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player cell
    const gradient = ctx.createRadialGradient(p.x - 8, p.y - 8, 4, p.x, p.y, p.radius + 4);
    gradient.addColorStop(0, '#9bd0ff');
    gradient.addColorStop(1, '#4577ff');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  /** Data for HUD. */
  getHUDData() {
    const p = this.player;
    return {
      stageLabel: this.stageName,
      health: `${p.health.toFixed(0)} / ${p.maxHealth}`,
      energy: p.energy.toFixed(0),
      points: p.evoPoints,
      trait: 'Single-cell generalist',
      description: 'Guide a solitary cell, collect food, evade hazards, and evolve core stats.',
    };
  }
}
