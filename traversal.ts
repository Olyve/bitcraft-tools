import { recipeGraph } from './item-graph';

export type Range = { min: number; max: number };
export type Totals = Record<string, Range> | Record<string, number>;

export function getTotalInputs(
  itemId: string,
  amount: number
): Record<string, number | Range> {
  const totals: Record<string, Range> = {};

  const recipes = recipeGraph[itemId];
  if (!recipes || recipes.length === 0) {
    totals[itemId] = { min: amount, max: amount };
    return simplifyRanges(totals);
  }

  const recipe = recipes[0];
  const { min: outputMin, max: outputMax } = recipe.outputQty;

  const runsMin = Math.ceil(amount / outputMax);
  const runsMax = Math.ceil(amount / outputMin);

  for (const ingredient of recipe.ingredients) {
    const minAmount = ingredient.quantity * runsMin;
    const maxAmount = ingredient.quantity * runsMax;

    const subTotalsMin = getTotalInputs(ingredient.id, minAmount);
    const subTotalsMax = getTotalInputs(ingredient.id, maxAmount);

    for (const id of new Set([
      ...Object.keys(subTotalsMin),
      ...Object.keys(subTotalsMax),
    ])) {
      if (!totals[id]) totals[id] = { min: 0, max: 0 };

      const minVal =
        typeof subTotalsMin[id] === 'number'
          ? subTotalsMin[id]
          : subTotalsMin[id]?.min ?? 0;
      const maxVal =
        typeof subTotalsMax[id] === 'number'
          ? subTotalsMax[id]
          : subTotalsMax[id]?.max ?? 0;

      totals[id].min += minVal;
      totals[id].max += maxVal;
    }
  }

  return simplifyRanges(totals);
}

function simplifyRanges(
  totals: Record<string, Range>
): Record<string, number | Range> {
  const simplified: Record<string, number | Range> = {};
  for (const key in totals) {
    const { min, max } = totals[key];
    simplified[key] = min === max ? min : { min, max };
  }
  return simplified;
}
