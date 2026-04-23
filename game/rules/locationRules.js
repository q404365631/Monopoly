import { checkGoToJail } from "./checkers/checkGoToJail.js";
import { checkTax } from "./checkers/checkTax.js";
import { checkGoBankrupt } from "./checkers/checkGoBankrupt.js";
import { checkCanBuy } from "./checkers/checkCanBuy.js";
import { checkPayRent } from "./checkers/checkPayRent.js";

export const locationRules = {
  /**
   * Handles the actions that occur when a player lands on a tile, including: 
   * paying rent, buying properties, and handling income tax.
   * @param {Object} game - The game object
   */
  handle(game) {
    executeLocationCheckerPipeline(game);
  }
};

function executeLocationCheckerPipeline(game) {
  for (const { checker } of locationCheckerPipeline) {
    checker(game);

    checkGoBankrupt(game);
    if(game.currentPlayer().isInJail || game.currentPlayer().isBankrupt) {
      return;
    }
  }
}

// Pipeline of location event checkers that execute in sequence.
const locationCheckerPipeline = [
  { checker: checkGoToJail },
  { checker: checkTax },
  { checker: checkCanBuy },
  { checker: checkPayRent },
];
