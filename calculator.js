export const defaultInputs = Object.freeze({
  ingredientCost: 0,
  batchSize: 0,
  handsOnHours: 0,
  hourlyRate: 18,
  boothFee: 0,
  packagingPerLoaf: 0.4,
  gasTravel: 0,
  unsoldLoaves: 0,
});

const numericKeys = Object.keys(defaultInputs);

export function sanitizeInputs(candidate = {}) {
  return Object.fromEntries(
    numericKeys.map((key) => {
      const parsed = Number(candidate[key]);
      return [key, Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultInputs[key]];
    }),
  );
}

export function sanitizeProfile(candidate = {}) {
  const hasEnvelope = candidate && typeof candidate.inputs === "object";
  const loafName = hasEnvelope ? String(candidate.loafName ?? "").trim() : "";
  return {
    loafName: loafName || "My Loaf",
    inputs: sanitizeInputs(hasEnvelope ? candidate.inputs : candidate),
  };
}

export function calculatePricing(candidate) {
  const input = sanitizeInputs(candidate);
  if (input.batchSize <= 0) throw new Error("Batch size must be positive.");

  for (const value of numericKeys.map((key) => Number(candidate?.[key] ?? defaultInputs[key]))) {
    if (Number.isFinite(value) && value < 0) throw new Error("Costs cannot be negative.");
  }

  const sellableLoaves = Math.max(1, input.batchSize - input.unsoldLoaves);
  const ingredientPerLoaf = input.ingredientCost / input.batchSize;
  const laborPerLoaf = (input.handsOnHours * input.hourlyRate) / sellableLoaves;
  const overheadPerLoaf = (input.boothFee + input.gasTravel) / sellableLoaves;
  const trueCostPerLoaf =
    ingredientPerLoaf + laborPerLoaf + overheadPerLoaf + input.packagingPerLoaf;

  return {
    sellableLoaves,
    ingredientPerLoaf,
    laborPerLoaf,
    overheadPerLoaf,
    packagingPerLoaf: input.packagingPerLoaf,
    trueCostPerLoaf,
    floorPrice: trueCostPerLoaf,
    suggestedPrice: trueCostPerLoaf / 0.4,
    hasUnsoldWarning: input.unsoldLoaves >= input.batchSize,
  };
}
