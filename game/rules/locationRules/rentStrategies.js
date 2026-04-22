import { countOwnedTiles, transferMoney } from "./helpers.js";

const RAILROAD_RENT_BY_COUNT = {
  1: 25,
  2: 50,
  3: 100,
  4: 200,
};

export const rentStrategies = [
  {
    name: "railroad",
    supports(tile) {
      return tile.type === "railroad";
    },
    collect(game, tile, player, owner) {
      const railroadsOwned = countOwnedTiles(game.board, owner.id, "railroad");
      const rent = RAILROAD_RENT_BY_COUNT[railroadsOwned] ?? tile.rent;
      const railroadsLabel = railroadsOwned === 1 ? "railroad" : "railroads";

      transferMoney(player, owner, rent);
      console.log(`${player.name} pays ${owner.name} $${rent} for landing on ${tile.name} (${railroadsOwned} ${railroadsLabel} owned).`);
    },
  },
  {
    name: "utility",
    supports(tile) {
      return tile.type === "utility";
    },
    collect(game, tile, player, owner) {
      const diceRollTotal = game.lastRoll && game.lastRoll.total;
      if (typeof diceRollTotal !== "number") {
        console.log(`Cannot calculate utility rent on ${tile.name} because last roll total is unavailable.`);
        return;
      }

      const utilitiesOwned = countOwnedTiles(game.board, owner.id, "utility");
      const rent = utilitiesOwned === 2 ? diceRollTotal * 10 : diceRollTotal * 4;
      const utilitiesLabel = utilitiesOwned === 1 ? "utility" : "utilities";

      transferMoney(player, owner, rent);
      console.log(`${player.name} pays ${owner.name} $${rent} for landing on ${tile.name} (${utilitiesOwned} ${utilitiesLabel} owned).`);
    },
  },
  {
    name: "default",
    supports() {
      return true;
    },
    collect(game, tile, player, owner) {
      transferMoney(player, owner, tile.rent);
      console.log(`${player.name} pays $${tile.rent} rent to ${owner.name}`);
    },
  },
];
