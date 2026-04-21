/**
 * Handles property purchasing when a player lands on an unowned property.
 * @param {Object} game - The game object
 */
export function handleBuyProperty(game) {
  const tile = game.board[game.currentPlayer().position];
  const isLocationAvailableForPurchase = tile && tile.ownerId === null && tile.price;
  if (!isLocationAvailableForPurchase) {
    return;
  }

  console.log(`${tile.name} is available for $${tile.price}`);

  if (tile.price > game.currentPlayer().money) {
    return;
  }

  game.currentPlayer().money -= tile.price;
  tile.ownerId = game.currentPlayer().id;
  game.currentPlayer().propertyIds = game.currentPlayer().propertyIds || [];
  game.currentPlayer().propertyIds.push(tile.id);
  console.log(`${game.currentPlayer().name} bought ${tile.name} for $${tile.price}.`);
}
