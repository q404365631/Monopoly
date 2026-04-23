export function buy(game, tile) {

  game.currentPlayer().money -= tile.price;
    tile.ownerId = game.currentPlayer().id;
    game.currentPlayer().propertyIds = game.currentPlayer().propertyIds || [];
    game.currentPlayer().propertyIds.push(tile.id);
    console.log(`${game.currentPlayer().name} bought ${tile.name} for $${tile.price}.`);
}
