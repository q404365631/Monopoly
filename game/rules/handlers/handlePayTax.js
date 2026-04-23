export function payTax(game, tile){
  game.currentPlayer().money -= tile.amount;
  console.log(`${game.currentPlayer().name} landed on ${tile.name} and lost $${tile.amount}`);
}