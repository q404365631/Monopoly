import { getCurrentPlayer } from "./helpers.js";

export function markBankruptIfNeeded(game) {
  const player = getCurrentPlayer(game);
  if (player.isBankrupt || player.money >= 0) {
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
