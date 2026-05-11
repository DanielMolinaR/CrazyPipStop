// Pure game-state transitions. Kept separate from any React component so
// they can be unit-tested without rendering or mocking navigation.
//
// All functions are pure: they read their inputs, return a new value, and
// never mutate. The whole game flow on top of React Navigation depends on
// this — `addResult` used to mutate `GameMode` in place, which broke
// back-button-as-undo because the previous screen's params were the *same*
// object that had just been changed under it.

import type { GameMode } from '../types';

/**
 * Compute the next game-mode state after a round resolves.
 *
 * - On a win, increments `victoryPoints`.
 * - On a loss, increments `losingPoints`.
 * - Clears `isPenalized` (a penalty only applies to the round that just ran).
 * - If the round was played under penalization, marks `isPenalizationUsed`
 *   so the player can't claim the same -5" bonus twice.
 */
export function advanceMode(mode: GameMode, userWon: boolean): GameMode {
  return {
    ...mode,
    victoryPoints: userWon ? mode.victoryPoints + 1 : mode.victoryPoints,
    losingPoints: userWon ? mode.losingPoints : mode.losingPoints + 1,
    isPenalized: false,
    isPenalizationUsed: mode.isPenalized ? true : mode.isPenalizationUsed,
  };
}

/**
 * Whether the game has reached a terminal state (win or lose threshold met).
 */
export function isGameOver(mode: GameMode): boolean {
  return (
    mode.victoryPoints >= mode.maxVictoryPoints ||
    mode.losingPoints >= mode.maxLosePoints
  );
}

/**
 * Whether the terminal state was a player victory. Only meaningful after
 * `isGameOver(mode)` returns true.
 */
export function didPlayerWin(mode: GameMode): boolean {
  return mode.victoryPoints >= mode.maxVictoryPoints;
}
