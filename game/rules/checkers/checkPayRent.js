import { payRent } from "../handlers/handlePayRent.js";

/**
 * Handles rent payment when a player lands on an owned property.
 * Calculates and processes rent based on property type: regular, railroad, or utility.
 * @param {Object} game - The game object
 */
export function checkPayRent(game) {
  const tile = game.board[game.currentPlayer().position];
  const isRentPaymentRequired =
    tile &&
    tile.price &&
    tile.ownerId !== null &&
    tile.ownerId !== undefined &&
    tile.ownerId !== game.currentPlayer().id;
  if (!isRentPaymentRequired) return;

  const owner = game.players.find((p) => p.id === tile.ownerId);
  if (!owner) return;

  if (owner.isInJail) {
    console.log(`${owner.name} is in jail and cannot collect rent from ${game.currentPlayer().name}.`);
    return;
  }

  payRent(game, tile, owner);
}
