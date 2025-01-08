import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let parameterCount = 0;
const evolutionParameters = new Map();

// Simulated contract functions
function setEvolutionParameters(automataId: number, generations: number, mutationRate: number, crossoverRate: number, populationSize: number, fitnessFunction: string) {
  const parameterId = ++parameterCount;
  evolutionParameters.set(parameterId, {
    automataId,
    generations,
    mutationRate,
    crossoverRate,
    populationSize,
    fitnessFunction
  });
  return parameterId;
}

function updateEvolutionParameters(parameterId: number, generations: number, mutationRate: number, crossoverRate: number, populationSize: number, fitnessFunction: string, updater: string) {
  if (updater !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  const params = evolutionParameters.get(parameterId);
  if (!params) throw new Error('Invalid parameters');
  params.generations = generations;
  params.mutationRate = mutationRate;
  params.crossoverRate = crossoverRate;
  params.populationSize = populationSize;
  params.fitnessFunction = fitnessFunction;
  evolutionParameters.set(parameterId, params);
  return true;
}

describe('Evolution Parameters Contract', () => {
  beforeEach(() => {
    parameterCount = 0;
    evolutionParameters.clear();
  });
  
  it('should set evolution parameters', () => {
    const parameterId = setEvolutionParameters(1, 1000, 0.01, 0.7, 100, 'max(alive_cells)');
    expect(parameterId).toBe(1);
    expect(evolutionParameters.size).toBe(1);
    const params = evolutionParameters.get(parameterId);
    expect(params.generations).toBe(1000);
    expect(params.mutationRate).toBe(0.01);
  });
  
  it('should update evolution parameters', () => {
    const parameterId = setEvolutionParameters(2, 500, 0.02, 0.8, 200, 'min(dead_cells)');
    expect(updateEvolutionParameters(parameterId, 600, 0.015, 0.75, 150, 'avg(alive_cells)', 'CONTRACT_OWNER')).toBe(true);
    const params = evolutionParameters.get(parameterId);
    expect(params.generations).toBe(600);
    expect(params.populationSize).toBe(150);
  });
  
  it('should not allow unauthorized updates', () => {
    const parameterId = setEvolutionParameters(3, 2000, 0.005, 0.9, 500, 'max(pattern_size)');
    expect(() => updateEvolutionParameters(parameterId, 2500, 0.01, 0.85, 400, 'min(entropy)', 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should maintain correct parameter information', () => {
    const parameterId = setEvolutionParameters(4, 1500, 0.03, 0.6, 300, 'max(symmetry)');
    const params = evolutionParameters.get(parameterId);
    expect(params.automataId).toBe(4);
    expect(params.crossoverRate).toBe(0.6);
    expect(params.fitnessFunction).toBe('max(symmetry)');
  });
});

