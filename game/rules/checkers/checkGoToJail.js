import { sendCurrentPlayerToJail } from "../handlers/handleJailRules.js";

/**
 * Handles the "Go To Jail" tile - sends the player to jail if they land on it.
 * @param {Object} game - The game object
 * @returns {boolean} - True if player was sent to jail, false otherwise
 */
export function checkGoToJail(game) {
  const tile = game.board[game.currentPlayer().position];
  if (!tile || tile.type !== "go-to-jail") {
    return false;
  }

  sendCurrentPlayerToJail(game);
  return true;
}
