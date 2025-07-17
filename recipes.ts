import { Tier } from './item-node';
import { Recipe } from './recipe';

export const recipes: Recipe[] = [
  {
    id: 'rough-stone-processing',
    outputId: 'rough-pebble',
    outputQty: {
      min: 8,
      max: 20,
    },
    ingredients: [{ id: 'rough-stone-chunk', quantity: 1 }],
    tier: Tier.T1,
    type: 'crafting',
  },
  {
    id: 'process-rough-trunk',
    outputId: 'rough-log',
    outputQty: { min: 6, max: 6 },
    ingredients: [{ id: 'rough-trunk', quantity: 1 }],
    tier: Tier.T1,
    type: 'crafting',
  },
  {
    id: 'make-basic-potters-mix',
    outputId: 'basic-potters-mix',
    outputQty: { min: 1, max: 1 },
    ingredients: [
      { id: 'rough-pebble', quantity: 5 },
      { id: 'basic-clay', quantity: 2 },
    ],
    tier: Tier.T1,
    type: 'crafting',
  },
  {
    id: 'make-unfired-rough-brick',
    outputId: 'unfired-rough-brick',
    outputQty: { min: 1, max: 1 },
    ingredients: [{ id: 'basic-potters-mix', quantity: 1 }],
    tier: Tier.T1,
    type: 'crafting',
  },
  {
    id: 'make-rough-brick',
    outputId: 'rough-brick',
    outputQty: { min: 1, max: 1 },
    ingredients: [
      { id: 'unfired-rough-brick', quantity: 1 },
      { id: 'rough-log', quantity: 1 },
    ],
    tier: Tier.T1,
    type: 'crafting',
  },
];
