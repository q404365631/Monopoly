import test from "node:test";
import assert from "node:assert/strict";
import { jailRules } from "../game/rules/handlers/handleJailRules.js";
import { locationRules } from "../game/rules/locationRules.js";
import { createTestGame } from "./helpers/createTestGame.js";

test("player goes to jail when landing on Go To Jail tile", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", position: 30 }, // Go To Jail tile
    { name: "Darth Vader" }
  ]);
  const player = game.players[0];

  locationRules.handle(game);

  assert.strictEqual(player.isInJail, true);
  assert.strictEqual(player.position, 10); // Jail tile
  assert.strictEqual(player.money, 1500); // No bonus for passing Start when sent to jail
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker is sent to jail for landing on Go To Jail.");
});

test("player in jail cannot collect rent", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", propertyIds: [1] },
    { name: "Darth Vader", position: 1 }
  ]);
  const playerInJail = game.players[0];
  const otherPlayer = game.players[1];
  playerInJail.isInJail = true;
  game.currentPlayerId = otherPlayer.id;
  
  locationRules.handle(game);

  assert.strictEqual(playerInJail.isInJail, true);
  assert.strictEqual(otherPlayer.money, 1500);
  assert.strictEqual(playerInJail.money, 1500);
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker is in jail and cannot collect rent from Darth Vader.");
});

test("player in jail can pay fine to get out", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker" },
    { name: "Darth Vader" }
  ]);
  const player = game.players[0];
  player.isInJail = true;

  const result = jailRules(game);

  assert.strictEqual(result.canMove, true);
  assert.strictEqual(player.isInJail, false);
  assert.strictEqual(player.money, 1500 - 50); // Paid $50 fine
  assert.strictEqual(player.failedJailRolls, 0);
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker pays $50 to get out of jail.");
});

test("player in jail can roll doubles to get out when they cannot pay", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", money: 40 },
    { name: "Darth Vader" }
  ]);
  const player = game.players[0];
  player.isInJail = true;
  game.rollDice = () => ({ dice1: 1, dice2: 1, total: 2, isDouble: true });
  
  const result = jailRules(game);

  assert.strictEqual(result.canMove, true);
  assert.deepStrictEqual(result.roll, { dice1: 1, dice2: 1, total: 2, isDouble: true });
  assert.strictEqual(result.usedJailRoll, true);
  assert.strictEqual(player.isInJail, false);
  assert.strictEqual(player.money, 40); // No fine paid, got out by rolling doubles
  assert.strictEqual(player.failedJailRolls, 0);
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker rolls doubles and gets out of jail.");
});

test("player in jail stays in jail after failing to roll doubles", (ctx) => {
  ctx.mock.method(console, "log", () => {});
  
  const game = createTestGame([
    { name: "Luke Skywalker", money: 40 },
    { name: "Darth Vader" }
  ]);
  const player = game.players[0];
  player.isInJail = true;
  game.rollDice = () => ({ dice1: 2, dice2: 3, total: 5, isDouble: false });
  
  const result = jailRules(game);

  assert.strictEqual(result.canMove, false);
  assert.strictEqual(player.isInJail, true);
  assert.strictEqual(player.money, 40); // No fine paid, still in jail
  assert.strictEqual(player.failedJailRolls, 1);
  assert.strictEqual(console.log.mock.calls[0].arguments[0], "Luke Skywalker fails to roll doubles and remains in jail.");
});

test("player in jail goes bankrupt after failing three turns and being unable to pay", (ctx) => {
  ctx.mock.method(console, "log", () => {});

  const game = createTestGame([
    { name: "Luke Skywalker", money: 30 },
    { name: "Darth Vader" }
  ]);
  const player = game.players[0];
  player.isInJail = true;
  game.rollDice = () => ({ dice1: 2, dice2: 3, total: 5, isDouble: false });

  const firstTurn = jailRules(game);
  const secondTurn = jailRules(game);
  const thirdTurn = jailRules(game);

  assert.strictEqual(firstTurn.canMove, false);
  assert.strictEqual(secondTurn.canMove, false);
  assert.strictEqual(thirdTurn.canMove, false);
  assert.strictEqual(player.isInJail, false);
  assert.strictEqual(player.isBankrupt, true);
  assert.strictEqual(player.failedJailRolls, 0);
  assert.strictEqual(console.log.mock.calls[2].arguments[0], "Luke Skywalker fails to roll doubles and remains in jail.");
  assert.strictEqual(console.log.mock.calls[3].arguments[0], "Luke Skywalker is bankrupt and out of the game.");
});
