import { handleJail } from "./handlers/jailHandler.js";
import { handleTax } from "./handlers/taxHandler.js";
import { handleBankruptcy } from "./handlers/bankruptHandler.js";
import { handleBuyProperty } from "./handlers/buyPropertyHandler.js";
import { handlePayRent } from "./handlers/rentHandler.js";

// Pipeline of location event handlers that execute in sequence.
const locationHandlerPipeline = [
  { handler: handleJail, stopsProcessing: true },
  { handler: handleTax, stopsProcessing: false },
  { handler: handleBuyProperty, stopsProcessing: false },
  { handler: handlePayRent, stopsProcessing: false },
];

/**
 * Checks if the current player is bankrupt and handles consequences.
 * @param {Object} game - The game object
 * @returns {boolean} - True if player is bankrupt, false otherwise
 */
function shouldStopProcessing(game) {
  handleBankruptcy(game);
  return game.currentPlayer().isBankrupt;
}

/**
 * Orchestrates the execution of location handlers in sequence.
 * @param {Object} game - The game object
 */
function executeLocationHandlers(game) {
  for (const { handler, stopsProcessing } of locationHandlerPipeline) {
    handler(game);

    // Check bankruptcy before continuing to next handler
    if (shouldStopProcessing(game)) {
      return;
    }

    // If handler signals to stop, exit early
    if (stopsProcessing && game.currentPlayer().isBankrupt === false) {
      const tile = game.board[game.currentPlayer().position];
      if (tile && tile.type === "go-to-jail") {
        return;
      }
    }
  }
}

export const locationRules = {
  /**
   * Handles the actions that occur when a player lands on a tile, including: 
   * paying rent, buying properties, and handling income tax.
   * @param {Object} game - The game object
   */
  handle(game) {
    executeLocationHandlers(game);
  }
};
