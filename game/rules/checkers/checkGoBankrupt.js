import { goBankrupt } from "../handlers/handleGoBankrupt.js";

/**
 * Handles bankruptcy conditions and consequences for players.
 * Marks a player as bankrupt if their money is negative, and releases all properties they owned.
 * @param {Object} game - The game object
 */
export function checkGoBankrupt(game) {
  const currentPlayer = game.currentPlayer();
  if (currentPlayer.isBankrupt || currentPlayer.money >= 0) {
    return;
  }

  goBankrupt(game, currentPlayer);
}
