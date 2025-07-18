import { Ingredient, Tier } from './item-node';

export type RecipeType = 'crafting' | 'gathering';

export type Recipe = {
  id: string;
  outputId: string;
  outputQty: {
    min: number;
    max: number;
  };
  ingredients: Ingredient[];
  tier: Tier;
  type: RecipeType;
};
