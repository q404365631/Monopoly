import test from "node:test";
import assert from "node:assert/strict";
import { createTestGame } from "./createTestGame.js";

test("creates a game with provided player setup and ownership on the board", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", position: 7, money: 900, propertyIds: [1, 5] },
    { name: "Darth Vader", position: 12, money: 1200, propertyIds: [12] },
  ]);

  assert.deepStrictEqual(game.players, [
    { id: 1, name: "Luke Skywalker", position: 7, money: 900, propertyIds: [1, 5], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
    { id: 2, name: "Darth Vader", position: 12, money: 1200, propertyIds: [12], isBankrupt: false, isInJail: false, failedJailRolls: 0 },
  ]);
  assert.strictEqual(game.board[1].ownerId, 1);
  assert.strictEqual(game.board[5].ownerId, 1);
  assert.strictEqual(game.board[12].ownerId, 2);
  assert.strictEqual(game.currentPlayerId, 1);
  assert.deepStrictEqual(game.currentPlayer(), game.players[0]);
});

test("copies propertyIds input and safely ignores unknown board ids", () => {
  const propertyIds = [1, 999];
  const game = createTestGame([
    { name: "Luke Skywalker", propertyIds },
    { name: "Darth Vader" },
  ]);

  propertyIds.push(5);

  assert.deepStrictEqual(game.players[0].propertyIds, [1, 999]);
  assert.strictEqual(game.board[1].ownerId, 1);
  assert.strictEqual(game.board[5].ownerId, null);
});

test("applies zero money overrides instead of falling back to defaults", () => {
  const game = createTestGame([
    { name: "Luke Skywalker", money: 0 },
    { name: "Darth Vader" },
  ]);

  assert.strictEqual(game.players[0].money, 0);
  assert.strictEqual(game.players[1].money, 1500);
});
