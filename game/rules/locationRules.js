import { sendCurrentPlayerToJail } from "./jailRules.js";
import { createLocationActionRules } from "./locationRules/actionRules.js";
import { markBankruptIfNeeded } from "./locationRules/bankruptcy.js";
import { getCurrentPlayer } from "./locationRules/helpers.js";
import { rentStrategies } from "./locationRules/rentStrategies.js";

const locationActionRules = createLocationActionRules({
  sendCurrentPlayerToJail,
  rentStrategies,
});

/**
 * Handles the rules for landing on different types of locations on the board.
 */
export const locationRules = {
  handle(game) {
    for (const rule of locationActionRules) {
      const result = rule.apply(game);
      markBankruptIfNeeded(game);

      if (result.stop || getCurrentPlayer(game).isBankrupt) {
        return;
      }
    }
  },
};
