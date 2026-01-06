import { clamp, distance, randomInArea } from '../../core/utils.js';
import { evolutionTree } from '../../config/evolutionTree.js';

/**
 * Stage 2: small aquatic creature prototype.
 * Features multi-part body rendering, plant food vs moving prey,
 * and an herbivore/carnivore tendency that influences rewards.
 */
export class Stage2 {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
  }

  reset() {
    this.player = {
      x: this.width / 2,
      y: this.height / 2,
      angle: 0,
      speed: 80,
      turnSpeed: 2.5,
      radius: 16,
      perception: 160,
      maxHealth: 100,
      health: 100,
      evoPoints: 0,
      diet: 'none', // herbivore or carnivore after upgrade
    };
    this.plants = [];
    this.prey = [];
    this.spawnTimer = 0;
    this.preyTimer = 0;
    this.stageName = 'Stage 2 – Small Aquatic Creature';
  }

  dietLabel() {
    if (this.player.diet === 'herbivore') return 'Herbivore (plant bonus)';
    if (this.player.diet === 'carnivore') return 'Carnivore (prey bonus)';
    return 'Diet not chosen';
  }

  getEvolutionOptions() {
    return [
      {
        id: 'herbivore',
        title: 'Filter Feeder (Herbivore)',
        desc: evolutionTree.stage2.herbivore.note,
        cost: evolutionTree.stage2.herbivore.cost,
        apply: () => {
          this.player.diet = 'herbivore';
          this.player.speed = evolutionTree.stage2.herbivore.bonuses.baseSpeed;
        },
      },
      {
        id: 'carnivore',
        title: 'Jawed Hunter (Carnivore)',
        desc: evolutionTree.stage2.carnivore.note,
        cost: evolutionTree.stage2.carnivore.cost,
        apply: () => {
          this.player.diet = 'carnivore';
          this.player.speed = evolutionTree.stage2.carnivore.bonuses.baseSpeed;
        },
      },
      {
        id: 'perception',
        title: 'Lateral Line (Perception)',
        desc: 'Fluid-sensitive organs widen detection.',
        cost: 3,
        apply: () => {
          this.player.perception += 25;
        },
      },
    ];
  }

  update(dt, input) {
    const p = this.player;
    // Turning-based movement for fish-like motion
    if (input.isDown('a') || input.isDown('arrowleft')) {
      p.angle -= p.turnSpeed * dt;
    }
    if (input.isDown('d') || input.isDown('arrowright')) {
      p.angle += p.turnSpeed * dt;
    }
    let thrust = 0;
    if (input.isDown('w') || input.isDown('arrowup')) thrust += 1;
    if (input.isDown('s') || input.isDown('arrowdown')) thrust -= 0.5;
    p.x += Math.cos(p.angle) * p.speed * thrust * dt;
    p.y += Math.sin(p.angle) * p.speed * thrust * dt;
    p.x = clamp(p.x, p.radius, this.width - p.radius);
    p.y = clamp(p.y, p.radius, this.height - p.radius);

    // Spawn plants and prey
    this.spawnTimer += dt;
    if (this.spawnTimer > 0.8 && this.plants.length < 25) {
      this.spawnTimer = 0;
      this.plants.push({ ...randomInArea(this.width, this.height, 20), radius: 8 });
    }

    this.preyTimer += dt;
    if (this.preyTimer > 1.8 && this.prey.length < 10) {
      this.preyTimer = 0;
      this.prey.push({
        ...randomInArea(this.width, this.height, 24),
        radius: 10,
        vx: (Math.random() - 0.5) * 60,
        vy: (Math.random() - 0.5) * 60,
        health: 10,
      });
    }

    // Move prey with simple wandering
    this.prey.forEach((prey) => {
      prey.x += prey.vx * dt;
      prey.y += prey.vy * dt;
      if (prey.x < prey.radius || prey.x > this.width - prey.radius) prey.vx *= -1;
      if (prey.y < prey.radius || prey.y > this.height - prey.radius) prey.vy *= -1;
    });

    // Plant collection
    this.plants = this.plants.filter((plant) => {
      if (distance(p, plant) < p.radius + plant.radius) {
        const bonus = this.player.diet === 'herbivore' ? evolutionTree.stage2.herbivore.bonuses.plantGain : 1;
        p.evoPoints += bonus;
        p.health = clamp(p.health + 3, 0, p.maxHealth);
        return false;
      }
      return true;
    });

    // Prey hunting (touch to eat)
    this.prey = this.prey.filter((prey) => {
      if (distance(p, prey) < p.radius + prey.radius) {
        const bonus = this.player.diet === 'carnivore' ? evolutionTree.stage2.carnivore.bonuses.preyGain : 1;
        p.evoPoints += bonus;
        p.health = clamp(p.health + 6, 0, p.maxHealth);
        return false;
      }
      return true;
    });
  }

  render(ctx) {
    const p = this.player;
    ctx.clearRect(0, 0, this.width, this.height);

    // Perception
    ctx.fillStyle = 'rgba(108, 242, 197, 0.06)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.perception, 0, Math.PI * 2);
    ctx.fill();

    // Plants
    ctx.fillStyle = '#6cf2c5';
    this.plants.forEach((plant) => {
      ctx.beginPath();
      ctx.ellipse(plant.x, plant.y, plant.radius, plant.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Prey
    ctx.fillStyle = '#f59e6c';
    this.prey.forEach((prey) => {
      ctx.beginPath();
      ctx.ellipse(prey.x, prey.y, prey.radius, prey.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player multi-part body
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    // tail
    ctx.fillStyle = '#2748a8';
    ctx.beginPath();
    ctx.moveTo(-p.radius - 10, 0);
    ctx.lineTo(-p.radius + 2, 8);
    ctx.lineTo(-p.radius + 2, -8);
    ctx.closePath();
    ctx.fill();

    // body
    ctx.fillStyle = '#68a8ff';
    ctx.beginPath();
    ctx.ellipse(0, 0, p.radius + 6, p.radius, 0, 0, Math.PI * 2);
    ctx.fill();

    // head
    ctx.fillStyle = '#9bd0ff';
    ctx.beginPath();
    ctx.ellipse(p.radius + 6, 0, p.radius * 0.8, p.radius * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // eye
    ctx.fillStyle = '#0b1020';
    ctx.beginPath();
    ctx.arc(p.radius + 10, -2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  getHUDData() {
    return {
      stageLabel: this.stageName,
      health: `${this.player.health.toFixed(0)} / ${this.player.maxHealth}`,
      energy: 'n/a',
      points: this.player.evoPoints,
      trait: this.dietLabel(),
      description: 'Aquatic prototype with diet specialization and multi-part body.',
    };
  }
}
