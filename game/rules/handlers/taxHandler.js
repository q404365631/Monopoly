/**
 * Handles tax locations - deducts money from player when landing on tax tiles.
 * @param {Object} game - The game object
 */
export function handleTax(game) {
  const tile = game.board[game.currentPlayer().position];
  if (tile && tile.type === "tax") {
    game.currentPlayer().money -= tile.amount;
    console.log(`${game.currentPlayer().name} landed on ${tile.name} and lost $${tile.amount}`);
  }
}
