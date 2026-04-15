const RENT_CALCULATORS = {
  property: calculatePropertyRent,
  railroad: calculateRailroadRent,
  utility: calculateUtilityRent,
};

const LOCATION_RULES_PIPELINE = [
  { execute: applyTaxRule },
  { execute: markBankruptIfNeeded, stopIfBankruptAfter: true },
  { execute: applyPurchaseRule },
  { execute: markBankruptIfNeeded, stopIfBankruptAfter: true },
  { execute: applyRentRule },
  { execute: markBankruptIfNeeded },
  { execute: applyGoToJailRule },
];

/**
 * Handles the rules for landing on different types of locations on the board.
 */
export const locationRules = {
  handle(game, tile) {
    const context = createLocationRuleContext(game, tile);

    for (const step of LOCATION_RULES_PIPELINE) {
      step.execute(context);

      if (step.stopIfBankruptAfter && context.player.isBankrupt) {
        return;
      }
    }
  },
};

function createLocationRuleContext(game, tile) {
  return {
    game,
    tile,
    player: game.currentPlayer(),
  };
}

function applyTaxRule({ player, tile }) {
  if (tile.type !== "tax") {
    return;
  }

  player.money -= tile.amount;
  console.log(`${player.name} landed on ${tile.name} and lost $${tile.amount}`);
}

function markBankruptIfNeeded({ player, game }) {
  if (player.isBankrupt || player.money >= 0) {
    return;
  }

  player.isBankrupt = true;
  releasePlayerProperties(player, game.board);
  console.log(`${player.name} is bankrupt and out of the game.`);
}

function releasePlayerProperties(player, board) {
  for (const tile of board) {
    if (tile.ownerId === player.id) {
      tile.ownerId = null;
    }
  }

  player.propertyIds = [];
}

function applyPurchaseRule({ player, tile }) {
  const isLocationAvailableForPurchase = tile && tile.ownerId === null && tile.price;
  if (!isLocationAvailableForPurchase) {
    return;
  }

  console.log(`${tile.name} is available for $${tile.price}`);

  if (tile.price > player.money) {
    return;
  }

  player.money -= tile.price;
  tile.ownerId = player.id;
  player.propertyIds = player.propertyIds || [];
  player.propertyIds.push(tile.id);
  console.log(`${player.name} bought ${tile.name} for $${tile.price}.`);
}

function applyRentRule({ player, tile, game }) {
  if (!isRentPaymentRequired(tile, player.id)) {
    return;
  }

  const owner = game.players.find((candidate) => candidate.id === tile.ownerId);
  if (!owner) {
    return;
  }

  if (owner.inJail) {
    console.log(`${owner.name} is in jail and cannot collect rent from ${player.name}`);
    return;
  }

  const rent = calculateRentForTile(game, tile, owner);
  player.money -= rent;
  owner.money += rent;
}

function isRentPaymentRequired(tile, playerId) {
  if (!tile || tile.ownerId == null || tile.ownerId === playerId) {
    return false;
  }

  if (tile.type === "utility") {
    return true;
  }

  return Boolean(tile.rent);
}

function applyGoToJailRule({ player, tile }) {
  if (tile.type !== "go-to-jail") {
    return;
  }

  player.position = 10;
  player.inJail = true;
  player.jailTurns = 0;
  console.log(`${player.name} is sent to jail for landing on Go To Jail`);
}

function calculateRentForTile(game, tile, owner) {
  const calculateRent = RENT_CALCULATORS[tile.type];
  if (!calculateRent) {
    return 0;
  }

  const { amount, message } = calculateRent(game, tile, owner);
  console.log(message);

  return amount;
}

function calculatePropertyRent(game, tile, owner) {
  const playerName = game.currentPlayer().name;
  const amount = tile.rent;

  return {
    amount,
    message: `${playerName} pays ${owner.name} $${amount} for landing on ${tile.name}`,
  };
}

function calculateRailroadRent(game, tile, owner) {
  const playerName = game.currentPlayer().name;
  const railroadsOwned = game.board.filter(
    (boardTile) => boardTile.type === "railroad" && boardTile.ownerId === tile.ownerId,
  ).length;

  const railroadRentAmounts = {
    1: 25,
    2: 50,
    3: 100,
    4: 200,
  };

  const amount = railroadRentAmounts[railroadsOwned] ?? 0;
  if (amount === 0) {
    return {
      amount,
      message: `Number of railroads owned by ${owner.name} is improper: ${railroadsOwned}. No rent is due for landing on ${tile.name}`,
    };
  }

  return {
    amount,
    message: `${playerName} pays ${owner.name} $${amount} for landing on ${tile.name} (${railroadsOwned} ${railroadsOwned === 1 ? "railroad" : "railroads"} owned)`,
  };
}

function calculateUtilityRent(game, tile, owner) {
  const playerName = game.currentPlayer().name;
  const diceTotal = game.rollDice.total;
  const utilitiesOwned = game.board.filter(
    (boardTile) => boardTile.type === "utility" && boardTile.ownerId === tile.ownerId,
  ).length;

  const utilityRentMultipliers = {
    1: 4,
    2: 10,
  };

  const multiplier = utilityRentMultipliers[utilitiesOwned] ?? 0;
  const amount = diceTotal * multiplier;
  if (amount === 0) {
    return {
      amount,
      message: `Number of utilities owned by ${owner.name} is improper: ${utilitiesOwned}. No rent is due for landing on ${tile.name}`,
    };
  }

  return {
    amount,
    message: `${playerName} pays ${owner.name} $${amount} for landing on ${tile.name} (${utilitiesOwned} ${utilitiesOwned === 1 ? "utility" : "utilities"} owned)`,
  };
}
