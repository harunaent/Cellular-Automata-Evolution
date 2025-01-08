import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let analysisCount = 0;
const behaviorAnalyses = new Map();

// Simulated contract functions
function submitBehaviorAnalysis(automataId: number, description: string, metrics: number[], analyzer: string) {
  const analysisId = ++analysisCount;
  behaviorAnalyses.set(analysisId, {
    automataId,
    analyzer,
    description,
    metrics,
    timestamp: Date.now()
  });
  return analysisId;
}

function updateBehaviorAnalysis(analysisId: number, description: string, metrics: number[], updater: string) {
  const analysis = behaviorAnalyses.get(analysisId);
  if (!analysis) throw new Error('Invalid analysis');
  if (updater !== analysis.analyzer) throw new Error('Not authorized');
  analysis.description = description;
  analysis.metrics = metrics;
  analysis.timestamp = Date.now();
  behaviorAnalyses.set(analysisId, analysis);
  return true;
}

describe('Emergent Behavior Analysis Contract', () => {
  beforeEach(() => {
    analysisCount = 0;
    behaviorAnalyses.clear();
  });
  
  it('should submit a new behavior analysis', () => {
    const analysisId = submitBehaviorAnalysis(1, 'Glider formation in Game of Life', [10, 20, 30, 40, 50], 'analyst1');
    expect(analysisId).toBe(1);
    expect(behaviorAnalyses.size).toBe(1);
    const analysis = behaviorAnalyses.get(analysisId);
    expect(analysis.description).toBe('Glider formation in Game of Life');
    expect(analysis.metrics).toEqual([10, 20, 30, 40, 50]);
  });
  
  it('should update behavior analysis', () => {
    const analysisId = submitBehaviorAnalysis(2, 'Oscillators in Rule 30', [5, 15, 25, 35, 45], 'analyst2');
    expect(updateBehaviorAnalysis(analysisId, 'Updated: Oscillators in Rule 30', [6, 16, 26, 36, 46], 'analyst2')).toBe(true);
    const analysis = behaviorAnalyses.get(analysisId);
    expect(analysis.description).toBe('Updated: Oscillators in Rule 30');
    expect(analysis.metrics).toEqual([6, 16, 26, 36, 46]);
  });
  
  it('should not allow unauthorized updates', () => {
    const analysisId = submitBehaviorAnalysis(3, 'Pattern formation in Langton\'s Ant', [1, 2, 3, 4, 5], 'analyst3');
    expect(() => updateBehaviorAnalysis(analysisId, 'Unauthorized update', [2, 3, 4, 5, 6], 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should maintain correct analysis information', () => {
    const analysisId = submitBehaviorAnalysis(4, 'Entropy analysis of Brian\'s Brain', [7, 14, 21, 28, 35], 'analyst4');
    const analysis = behaviorAnalyses.get(analysisId);
    expect(analysis.automataId).toBe(4);
    expect(analysis.analyzer).toBe('analyst4');
    expect(analysis.timestamp).toBeLessThanOrEqual(Date.now());
  });
});

