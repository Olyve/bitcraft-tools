import { ItemNode } from './item-node';
import { items } from './items';
import { Recipe } from './recipe';
import { recipes } from './recipes';

export const itemGraph: Record<string, ItemNode> = items.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, ItemNode>);

export const recipeGraph: Record<string, Recipe[]> = recipes.reduce(
  (acc, recipe) => {
    if (!acc[recipe.outputId]) acc[recipe.outputId] = [];
    acc[recipe.outputId].push(recipe);
    return acc;
  },
  {} as Record<string, Recipe[]>
);
