/**
 * Stage 4 skeleton: civilization overview layer.
 * Represents settlements, resources, and tech bars influenced by earlier traits.
 */
export class Stage4 {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.stageName = 'Stage 4 – Civilization (skeleton)';
  }

  reset() {
    // TODO: initialize settlements, resources, and population counters.
    this.cities = [];
  }

  getEvolutionOptions() {
    return [
      { id: 'production', title: 'Production Focus', desc: 'TODO: improve food/industry output.', cost: 5, apply: () => {} },
      { id: 'defense', title: 'Defensive Doctrine', desc: 'TODO: strengthen territorial defense.', cost: 5, apply: () => {} },
      { id: 'research', title: 'Curious Minds', desc: 'TODO: accelerate tech progression.', cost: 5, apply: () => {} },
    ];
  }

  update() {
    // TODO: implement resource tick, tech accumulation, mapping from prior traits.
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#0f1c2f';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#9bb0d0';
    ctx.fillText('Stage 4 skeleton – settlements, resources, and tech trees go here.', 30, this.height / 2);
  }

  getHUDData() {
    return {
      stageLabel: this.stageName,
      health: 'n/a',
      energy: 'n/a',
      points: 0,
      trait: 'Skeleton only',
      description: 'Abstracted civ view; wire up resource & tech systems later.',
    };
  }
}
