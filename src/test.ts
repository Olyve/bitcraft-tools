import { recipeGraph, itemGraph } from './item-graph';

export type RecipeNode = {
  id: string;
  name: string;
  amount: number;
  range: { min: number; max: number };
  children: RecipeNode[];
};

function buildRecipeTree(itemId: string, amount: number): RecipeNode {
  const recipes = recipeGraph[itemId];
  const name = itemGraph[itemId]?.displayName || itemId;

  if (!recipes || recipes.length === 0) {
    return {
      id: itemId,
      name,
      amount,
      range: { min: amount, max: amount },
      children: [],
    };
  }

  const recipe = recipes[0];
  const { min: outputMin, max: outputMax } = recipe.outputQty;
  const runsMin = Math.ceil(amount / outputMax);
  const runsMax = Math.ceil(amount / outputMin);

  const children: RecipeNode[] = recipe.ingredients.map((ingredient) => {
    const minAmount = ingredient.quantity * runsMin;
    const maxAmount = ingredient.quantity * runsMax;
    const avgAmount = Math.round((minAmount + maxAmount) / 2);
    return buildRecipeTree(ingredient.id, avgAmount);
  });

  return {
    id: itemId,
    name,
    amount,
    range: { min: amount, max: amount },
    children,
  };
}

function printTree(node: RecipeNode, indent = 0) {
  const prefix = '  '.repeat(indent);
  const range =
    node.range.min === node.range.max
      ? `${node.range.min}`
      : `${node.range.min}-${node.range.max}`;
  console.log(`${prefix}- ${node.name}: ${range}`);
  for (const child of node.children) {
    printTree(child, indent + 1);
  }
}

console.log('\nNested dependency tree for 1 Rough Brick:');
const tree = buildRecipeTree('rough-brick', 1);
printTree(tree);

console.log('\nNested dependency tree for 27 Rough Bricks:');
const tree2 = buildRecipeTree('rough-brick', 27);
printTree(tree2);
