export function getCurrentPlayer(game) {
  return game.currentPlayer();
}

export function getCurrentTile(game) {
  return game.board[getCurrentPlayer(game).position];
}

export function isPurchasable(tile) {
  return Boolean(tile && tile.price);
}

export function isRentPaymentRequired(tile, player) {
  return Boolean(
    tile
      && tile.price
      && tile.ownerId !== null
      && tile.ownerId !== undefined
      && tile.ownerId !== player.id,
  );
}

export function transferMoney(fromPlayer, toPlayer, amount) {
  fromPlayer.money -= amount;
  toPlayer.money += amount;
}

export function countOwnedTiles(board, ownerId, type) {
  return board.filter((tile) => tile.type === type && tile.ownerId === ownerId).length;
}
