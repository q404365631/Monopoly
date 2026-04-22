import {
  getCurrentPlayer,
  getCurrentTile,
  isPurchasable,
  isRentPaymentRequired,
} from "./helpers.js";

export function createLocationActionRules({ sendCurrentPlayerToJail, rentStrategies }) {
  return [
    {
      name: "go-to-jail",
      apply(game) {
        const tile = getCurrentTile(game);
        if (!tile || tile.type !== "go-to-jail") {
          return { stop: false };
        }

        sendCurrentPlayerToJail(game);
        return { stop: true };
      },
    },
    {
      name: "tax",
      apply(game) {
        const tile = getCurrentTile(game);
        if (!tile || tile.type !== "tax") {
          return { stop: false };
        }

        const player = getCurrentPlayer(game);
        player.money -= tile.amount;
        console.log(`${player.name} landed on ${tile.name} and lost $${tile.amount}`);
        return { stop: false };
      },
    },
    {
      name: "buy-property",
      apply(game) {
        const tile = getCurrentTile(game);
        if (!isPurchasable(tile) || tile.ownerId !== null) {
          return { stop: false };
        }

        const player = getCurrentPlayer(game);
        console.log(`${tile.name} is available for $${tile.price}`);

        if (tile.price > player.money) {
          return { stop: false };
        }

        player.money -= tile.price;
        tile.ownerId = player.id;
        player.propertyIds = player.propertyIds || [];
        player.propertyIds.push(tile.id);
        console.log(`${player.name} bought ${tile.name} for $${tile.price}.`);
        return { stop: false };
      },
    },
    {
      name: "pay-rent",
      apply(game) {
        const tile = getCurrentTile(game);
        const player = getCurrentPlayer(game);
        if (!isRentPaymentRequired(tile, player)) {
          return { stop: false };
        }

        const owner = game.players.find((candidate) => candidate.id === tile.ownerId);
        if (!owner) {
          return { stop: false };
        }

        if (owner.isInJail) {
          console.log(`${owner.name} is in jail and cannot collect rent from ${player.name}.`);
          return { stop: false };
        }

        const rentStrategy = rentStrategies.find((strategy) => strategy.supports(tile));
        if (!rentStrategy) {
          return { stop: false };
        }

        rentStrategy.collect(game, tile, player, owner);
        return { stop: false };
      },
    },
  ];
}
