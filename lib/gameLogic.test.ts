import { advanceMode, isGameOver, didPlayerWin, cloneGameMode } from './gameLogic';
import { gameModes } from './gameModes';
import type { GameMode } from '../types';

const baseMode: GameMode = {
  name: 'TEST',
  secondsCounter: 30,
  audios: [],
  victoryAudios: [],
  defeatAudios: [],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 4,
  hasPenalization: false,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 0,
  penalizedAudios: [],
};

describe('advanceMode', () => {
  it('increments victoryPoints when the user won', () => {
    const next = advanceMode(baseMode, true);
    expect(next.victoryPoints).toBe(1);
    expect(next.losingPoints).toBe(0);
  });

  it('increments losingPoints when the user lost', () => {
    const next = advanceMode(baseMode, false);
    expect(next.losingPoints).toBe(1);
    expect(next.victoryPoints).toBe(0);
  });

  it('clears isPenalized regardless of outcome', () => {
    const penalized: GameMode = { ...baseMode, isPenalized: true };
    expect(advanceMode(penalized, true).isPenalized).toBe(false);
    expect(advanceMode(penalized, false).isPenalized).toBe(false);
  });

  it('marks the penalization used when this round was played penalized', () => {
    const penalized: GameMode = { ...baseMode, isPenalized: true };
    expect(advanceMode(penalized, true).isPenalizationUsed).toBe(true);
  });

  it('preserves isPenalizationUsed when not penalized this round', () => {
    const used: GameMode = { ...baseMode, isPenalizationUsed: true };
    expect(advanceMode(used, true).isPenalizationUsed).toBe(true);
  });

  it('does not mutate its input', () => {
    const before = JSON.stringify(baseMode);
    advanceMode(baseMode, true);
    expect(JSON.stringify(baseMode)).toBe(before);
  });
});

describe('isGameOver', () => {
  it('returns false at the start of a game', () => {
    expect(isGameOver(baseMode)).toBe(false);
  });

  it('returns false in the middle of a game', () => {
    expect(isGameOver({ ...baseMode, victoryPoints: 2, losingPoints: 1 })).toBe(false);
  });

  it('returns true when victoryPoints reaches maxVictoryPoints', () => {
    expect(isGameOver({ ...baseMode, victoryPoints: 5 })).toBe(true);
  });

  it('returns true when losingPoints reaches maxLosePoints', () => {
    expect(isGameOver({ ...baseMode, losingPoints: 4 })).toBe(true);
  });

  it('returns true when both thresholds are met (rare but possible)', () => {
    expect(isGameOver({ ...baseMode, victoryPoints: 5, losingPoints: 4 })).toBe(true);
  });
});

describe('didPlayerWin', () => {
  it('returns true when the player hit the victory threshold', () => {
    expect(didPlayerWin({ ...baseMode, victoryPoints: 5 })).toBe(true);
  });

  it('returns false when the player only hit the loss threshold', () => {
    expect(didPlayerWin({ ...baseMode, losingPoints: 4 })).toBe(false);
  });
});

describe('advanceMode + isGameOver: full round-trip', () => {
  it('a 5-victory streak ends the game with a win', () => {
    let m: GameMode = baseMode;
    for (let i = 0; i < 5; i++) m = advanceMode(m, true);
    expect(isGameOver(m)).toBe(true);
    expect(didPlayerWin(m)).toBe(true);
  });

  it('a 4-loss streak ends the game with a loss', () => {
    let m: GameMode = baseMode;
    for (let i = 0; i < 4; i++) m = advanceMode(m, false);
    expect(isGameOver(m)).toBe(true);
    expect(didPlayerWin(m)).toBe(false);
  });
});

describe('cloneGameMode', () => {
  it('returns a deep clone with new audio-array references', () => {
    const source: GameMode = {
      ...baseMode,
      audios: [1, 2],
      victoryAudios: [3],
      defeatAudios: [4, 5],
      penalizedAudios: [6],
    };
    const cloned = cloneGameMode(source);

    // Same scalar values
    expect(cloned.name).toBe(source.name);
    expect(cloned.secondsCounter).toBe(source.secondsCounter);

    // Every audio array is a fresh reference (not shared with the source).
    expect(cloned.audios).not.toBe(source.audios);
    expect(cloned.victoryAudios).not.toBe(source.victoryAudios);
    expect(cloned.defeatAudios).not.toBe(source.defeatAudios);
    expect(cloned.penalizedAudios).not.toBe(source.penalizedAudios);

    // …but the contents are equal.
    expect(cloned.audios).toEqual(source.audios);
    expect(cloned.victoryAudios).toEqual(source.victoryAudios);
    expect(cloned.defeatAudios).toEqual(source.defeatAudios);
    expect(cloned.penalizedAudios).toEqual(source.penalizedAudios);
  });
});

describe('gameModes catalog', () => {
  it('exposes the 4 modes, each with at least one countdown audio', () => {
    expect(gameModes).toHaveLength(4);
    for (const mode of gameModes) {
      expect(mode.audios.length).toBeGreaterThan(0);
    }
  });
});
