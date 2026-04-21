/**
 * Handles bankruptcy conditions and consequences for players.
 * Marks a player as bankrupt if their money is negative, and releases all properties they owned.
 * @param {Object} game - The game object
 */
export function handleBankruptcy(game) {
  const currentPlayer = game.currentPlayer();
  if (currentPlayer.isBankrupt || currentPlayer.money >= 0) {
    return;
  }

  markPlayerBankrupt(game, currentPlayer);
}

/**
 * Releases all properties owned by a player (sets them as unowned on the board).
 * @param {Object} game - The game object
 * @param {Object} player - The player whose properties should be released
 */
function releasePlayerProperties(game, player) {
  for (const tile of game.board) {
    if (tile.ownerId === player.id) {
      tile.ownerId = null;
    }
  }

  player.propertyIds = [];
}

/**
 * Marks a player as bankrupt and releases all their owned properties.
 * @param {Object} game - The game object
 * @param {Object} player - The player to mark bankrupt
 */
export function markPlayerBankrupt(game, player) {
  if (player.isBankrupt) {
    return;
  }

  player.isBankrupt = true;
  releasePlayerProperties(game, player);
  console.log(`${player.name} is bankrupt and out of the game.`);
}
