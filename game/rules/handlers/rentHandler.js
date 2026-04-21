/**
 * Handles rent payment when a player lands on an owned property.
 * Calculates and processes rent based on property type: regular, railroad, or utility.
 * @param {Object} game - The game object
 */
export function handlePayRent(game) {
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

  if (tile.type === "railroad") {
    handleRailroadRent(game, tile, owner);
    return;
  }

  if (tile.type === "utility") {
    handleUtilityRent(game, tile, owner);
    return;
  }

  handlePropertyRent(game, tile, owner);
}

/**
 * Handles rent calculation for railroads based on number owned.
 */
function handleRailroadRent(game, tile, owner) {
  let railroadRent = tile.rent;
  const railroadsOwned = game.board.filter((t) => t.type === "railroad" && t.ownerId === owner.id).length;
  const railroadsLabel = railroadsOwned === 1 ? "railroad" : "railroads";

  if (railroadsOwned === 2) {
    railroadRent = 50;
  } else if (railroadsOwned === 3) {
    railroadRent = 100;
  } else if (railroadsOwned === 4) {
    railroadRent = 200;
  }

  game.currentPlayer().money -= railroadRent;
  owner.money += railroadRent;
  console.log(`${game.currentPlayer().name} pays ${owner.name} $${railroadRent} for landing on ${tile.name} (${railroadsOwned} ${railroadsLabel} owned).`);
}

/**
 * Handles rent calculation for utilities based on dice roll and number owned.
 */
function handleUtilityRent(game, tile, owner) {
  const diceRollTotal = game.lastRoll && game.lastRoll.total;
  if (typeof diceRollTotal !== "number") {
    console.log(`Cannot calculate utility rent on ${tile.name} because last roll total is unavailable.`);
    return;
  }

  const utilitiesOwned = game.board.filter((t) => t.type === "utility" && t.ownerId === owner.id).length;
  const utilitiesLabel = utilitiesOwned === 1 ? "utility" : "utilities";
  const utilityRent = utilitiesOwned === 2 ? diceRollTotal * 10 : diceRollTotal * 4;

  game.currentPlayer().money -= utilityRent;
  owner.money += utilityRent;
  console.log(`${game.currentPlayer().name} pays ${owner.name} $${utilityRent} for landing on ${tile.name} (${utilitiesOwned} ${utilitiesLabel} owned).`);
}

/**
 * Handles regular property rent payment.
 */
function handlePropertyRent(game, tile, owner) {
  const rent = tile.rent;
  game.currentPlayer().money -= rent;
  owner.money += rent;
  console.log(`${game.currentPlayer().name} pays $${rent} rent to ${owner.name}`);
}
