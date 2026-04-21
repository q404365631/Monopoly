import { markPlayerBankrupt } from "./handlers/bankruptHandler.js";

const JAIL_FINE = 50;
const JAIL_TILE_ID = 10;
const MAX_FAILED_JAIL_ROLLS = 3;

export function jailRules(game) {
  const player = game.currentPlayer();
  if (player === null || player === undefined || player.isBankrupt || !player.isInJail) {
    return {
      canMove: true,
      roll: null,
      usedJailRoll: false,
    };
  }

  if (player.money >= JAIL_FINE) {
    releasePlayerFromJail(player);
    player.money -= JAIL_FINE;
    console.log(`${player.name} pays $50 to get out of jail.`);

    return {
      canMove: true,
      roll: null,
      usedJailRoll: false,
    };
  }

  const roll = game.rollDice();
  if (roll.isDouble) {
    releasePlayerFromJail(player);
    console.log(`${player.name} rolls doubles and gets out of jail.`);

    return {
      canMove: true,
      roll,
      usedJailRoll: true,
    };
  }

  player.failedJailRolls += 1;
  console.log(`${player.name} fails to roll doubles and remains in jail.`);

  if (player.failedJailRolls < MAX_FAILED_JAIL_ROLLS) {
    return {
      canMove: false,
      roll,
      usedJailRoll: true,
    };
  }

  releasePlayerFromJail(player);

  if (player.money < JAIL_FINE) {
    markPlayerBankrupt(game, player);
    return {
      canMove: false,
      roll: null,
      usedJailRoll: true,
    };
  }

  player.money -= JAIL_FINE;
  console.log(`${player.name} pays $50 to get out of jail.`);

  return {
    canMove: true,
    roll,
    usedJailRoll: true,
  };
}

export function sendCurrentPlayerToJail(game) {
  const player = game.currentPlayer();
  if (player === null || player === undefined) {
    return;
  }

  player.position = JAIL_TILE_ID;
  player.isInJail = true;
  player.failedJailRolls = 0;
  console.log(`${player.name} is sent to jail for landing on Go To Jail.`);
}

function releasePlayerFromJail(player) {
  player.isInJail = false;
  player.failedJailRolls = 0;
}
