/**
 * Light-weight, data-driven descriptors for evolution choices across stages.
 * These values can be referenced by future stages to cascade bonuses.
 */
export const evolutionTree = {
  stage1: {
    speed: { cost: 3, delta: 20, note: 'Flagella improve thrust and quick bursts.' },
    perception: { cost: 3, delta: 20, note: 'Primitive sensory hairs expand awareness.' },
    health: { cost: 4, delta: 10, note: 'Thicker membrane resists hazards.' },
  },
  stage2: {
    herbivore: {
      cost: 4,
      bonuses: { plantGain: 2, baseSpeed: 80 },
      note: 'Filter feeders thrive on abundant plants with steady gains.',
    },
    carnivore: {
      cost: 4,
      bonuses: { preyGain: 3, baseSpeed: 90 },
      note: 'Predatory adaptations boost speed and prey rewards.' },
  },
  stage3: {
    placeholders: ['packBehavior', 'camouflage', 'nocturnal'],
  },
  stage4: {
    techBranches: ['production', 'defense', 'research'],
    mappingNotes: 'Early social traits map to cohesion and efficiency bonuses.',
  },
};
