import { buy } from "../handlers/handleBuy.js";

/**
 * Handles property purchasing when a player lands on an unowned property.
 * @param {Object} game - The game object
 */
export function checkCanBuy(game) {
  const tile = game.board[game.currentPlayer().position];
  const isLocationAvailableForPurchase = tile && tile.ownerId === null && tile.price;
  if (!isLocationAvailableForPurchase) {
    return;
  }

  console.log(`${tile.name} is available for $${tile.price}`);

  if (tile.price > game.currentPlayer().money) {
    return;
  }

  buy(game, tile);
}
