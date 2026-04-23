export function goBankrupt(game, player) {
  if (player.isBankrupt) {
    return;
  }

  player.isBankrupt = true;
  releasePlayerProperties(game, player);
  console.log(`${player.name} is bankrupt and out of the game.`);
}

function releasePlayerProperties(game, player) {
  for (const tile of game.board) {
    if (tile.ownerId === player.id) {
      tile.ownerId = null;
    }
  }

  player.propertyIds = [];
}
