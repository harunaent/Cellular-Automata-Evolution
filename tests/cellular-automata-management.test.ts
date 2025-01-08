import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let automataCount = 0;
const cellularAutomata = new Map();

// Simulated contract functions
function createCellularAutomata(name: string, description: string, rules: number[], dimensions: number, size: number, creator: string) {
  const automataId = ++automataCount;
  cellularAutomata.set(automataId, {
    creator,
    name,
    description,
    rules,
    dimensions,
    size,
    status: 'active'
  });
  return automataId;
}

function updateAutomataStatus(automataId: number, newStatus: string, updater: string) {
  const automata = cellularAutomata.get(automataId);
  if (!automata) throw new Error('Invalid automata');
  if (updater !== 'CONTRACT_OWNER' && updater !== automata.creator) throw new Error('Not authorized');
  automata.status = newStatus;
  cellularAutomata.set(automataId, automata);
  return true;
}

describe('Cellular Automata Management Contract', () => {
  beforeEach(() => {
    automataCount = 0;
    cellularAutomata.clear();
  });
  
  it('should create a new cellular automata', () => {
    const automataId = createCellularAutomata('Game of Life', 'Conway\'s Game of Life', [0, 1, 0, 1, 1, 1, 0, 0], 2, 100, 'user1');
    expect(automataId).toBe(1);
    expect(cellularAutomata.size).toBe(1);
    const automata = cellularAutomata.get(automataId);
    expect(automata.name).toBe('Game of Life');
    expect(automata.status).toBe('active');
  });
  
  it('should update automata status', () => {
    const automataId = createCellularAutomata('Rule 30', 'Wolfram\'s Rule 30', [0, 1, 1, 1, 1, 0, 0, 0], 1, 200, 'user2');
    expect(updateAutomataStatus(automataId, 'inactive', 'CONTRACT_OWNER')).toBe(true);
    const automata = cellularAutomata.get(automataId);
    expect(automata.status).toBe('inactive');
  });
  
  it('should not allow unauthorized status updates', () => {
    const automataId = createCellularAutomata('Langton\'s Ant', 'Langton\'s Ant cellular automaton', [1, 0, 1, 0], 2, 150, 'user3');
    expect(() => updateAutomataStatus(automataId, 'inactive', 'unauthorized_user')).toThrow('Not authorized');
  });
  
  it('should allow creator to update status', () => {
    const automataId = createCellularAutomata('Brian\'s Brain', 'Brian\'s Brain cellular automaton', [1, 1, 0, 0, 1, 0, 1, 1], 2, 120, 'user4');
    expect(updateAutomataStatus(automataId, 'archived', 'user4')).toBe(true);
    const automata = cellularAutomata.get(automataId);
    expect(automata.status).toBe('archived');
  });
});

