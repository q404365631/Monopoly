import { movePlayer } from "./movePlayer.js";
import { jailRules } from "./rules/handlers/handleJailRules.js";

export function playRound(game) {
  const turnsToPlay = game.countActivePlayers();
  for (let turn = 0; turn < turnsToPlay; turn++) {
    const currentPlayer = game.nextActivePlayer();
    if (!currentPlayer || currentPlayer.isBankrupt) {
      continue;
    }
    game.currentPlayerId = currentPlayer.id;
    executePlayerTurn(game);
  }
}

function executePlayerTurn(game) {
  let doublesCount = 0;
  let hasDouble = true;
  while (hasDouble && doublesCount < 3) {
    const currentPlayer = game.currentPlayer();
    if (currentPlayer === null || currentPlayer === undefined || currentPlayer.isBankrupt) {
      return;
    }

    const jailResult = jailRules(game);
    if (!jailResult.canMove) {
      return;
    }

    const roll = jailResult.roll ?? game.rollDice();
    game.lastRoll = roll;
    movePlayer(game, roll.total);

    const updatedPlayer = game.currentPlayer();
    if (updatedPlayer === null || updatedPlayer === undefined || updatedPlayer.isBankrupt || updatedPlayer.isInJail) {
      return;
    }

    hasDouble = roll.isDouble && !jailResult.usedJailRoll;
    if (hasDouble) {
      console.log(
        `${currentPlayer.name} rolled doubles: ${roll.dice1} & ${roll.dice2} and gets another turn!`,
      );
      doublesCount++;
    }
  }
}
