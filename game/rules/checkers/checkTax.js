import { payTax } from "../handlers/handlePayTax.js";

/**
 * Handles tax locations - deducts money from player when landing on tax tiles.
 * @param {Object} game - The game object
 */
export function checkTax(game) {
  const tile = game.board[game.currentPlayer().position];
  if (tile && tile.type === "tax") {
    payTax(game, tile);
  }
}
