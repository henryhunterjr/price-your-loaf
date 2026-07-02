import test from "node:test";
import assert from "node:assert/strict";
import { calculatePricing, sanitizeInputs } from "./calculator.js";

test("matches the From Oven to Market production formula", () => {
  const result = calculatePricing({
    ingredientCost: 24,
    batchSize: 10,
    handsOnHours: 2.5,
    hourlyRate: 18,
    boothFee: 25,
    packagingPerLoaf: 0.4,
    gasTravel: 15,
    unsoldLoaves: 2,
  });

  assert.equal(result.sellableLoaves, 8);
  assert.equal(result.trueCostPerLoaf, 13.425);
  assert.equal(result.floorPrice, 13.425);
  assert.equal(result.suggestedPrice, 33.5625);
});

test("uses one sellable loaf when unsold inventory reaches the batch size", () => {
  const result = calculatePricing({
    ingredientCost: 12,
    batchSize: 4,
    handsOnHours: 2,
    hourlyRate: 10,
    boothFee: 3,
    packagingPerLoaf: 0.5,
    gasTravel: 2,
    unsoldLoaves: 5,
  });

  assert.equal(result.sellableLoaves, 1);
  assert.equal(result.trueCostPerLoaf, 28.5);
  assert.equal(result.hasUnsoldWarning, true);
});

test("rejects an empty batch and negative values", () => {
  assert.throws(() => calculatePricing({ batchSize: 0 }), /batch size/i);
  assert.throws(
    () => calculatePricing({ batchSize: 1, ingredientCost: -1 }),
    /negative/i,
  );
});

test("sanitizes saved browser values", () => {
  const result = sanitizeInputs({ batchSize: "12", hourlyRate: "22.50" });

  assert.equal(result.batchSize, 12);
  assert.equal(result.hourlyRate, 22.5);
  assert.equal(result.packagingPerLoaf, 0.4);
});
