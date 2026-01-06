/**
 * Stage 3 skeleton: land creature framework.
 * 2D terrain tiles (grass/forest/rock/water) and group behavior will be added later.
 */
export class Stage3 {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.stageName = 'Stage 3 – Land Creature (skeleton)';
    this.notes = 'TODO: terrain tiles, day/night cycle, followers, and defensive traits.';
  }

  reset() {
    // Placeholder for future implementation: spawn land creature with legs/eyes/body.
  }

  getEvolutionOptions() {
    // Placeholder options to highlight future directions.
    return [
      { id: 'pack', title: 'Pack Behavior', desc: 'TODO: spawn followers for hunts.', cost: 5, apply: () => {} },
      { id: 'camouflage', title: 'Camouflage', desc: 'TODO: reduce detection on matching terrain.', cost: 4, apply: () => {} },
    ];
  }

  update() {
    // TODO: implement movement, terrain effects, followers, predator logic.
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#12212f';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#9bb0d0';
    ctx.fillText('Stage 3 skeleton – extend terrain, packs, and stealth here.', 40, this.height / 2);
  }

  getHUDData() {
    return {
      stageLabel: this.stageName,
      health: 'n/a',
      energy: 'n/a',
      points: 0,
      trait: 'Skeleton only',
      description: this.notes,
    };
  }
}
