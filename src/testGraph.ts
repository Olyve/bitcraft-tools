import {
  createEmptyItemGraph,
  planCraftingRequirements,
  estimateInputForYields,
} from './graph';

const itemGraph = createEmptyItemGraph();

// Rough Stone to Pebbles
itemGraph.setNode('rough-stone-chunk', 'Rough Stone Chunk');
itemGraph.setNode('rough-pebble', 'Rough Pebble');
itemGraph.setEdge('rough-stone-chunk', 'rough-pebble', {
  min: 7,
  max: 19,
  type: 'yield',
});

// More complex test - creation of T1 bricks
itemGraph.setNode('basic-clay', 'Basic Clay Lump');
itemGraph.setNode('basic-potters-mix', 'Basic Potters Mix');
itemGraph.setEdge('basic-clay', 'basic-potters-mix', {
  min: 1,
  max: 1,
  type: 'requirement',
});
itemGraph.setEdge('rough-pebble', 'basic-potters-mix', {
  min: 4,
  max: 4,
  type: 'requirement',
});

// ---- Set up test to prevent cycles - example: farming ----
itemGraph.setNode('simple-embergrain-seed', 'Simple Embergrain Seed');
itemGraph.setNode('simple-fertilizer', 'Simple Fertilizer');
itemGraph.setNode('water-bucket', 'Water Bucket');
itemGraph.setNode('simple-embergrain-plant', 'Simple Embergrain Plant');
itemGraph.setNode('simple-embergrain', 'Simple Embergrain');
itemGraph.setNode('simple-straw', 'Simple Straw');

// Requirement Edges
itemGraph.setEdge('simple-embergrain-seed', 'simple-embergrain-plant', {
  min: 1,
  max: 1,
  type: 'requirement',
});
itemGraph.setEdge('simple-fertilizer', 'simple-embergrain-plant', {
  min: 1,
  max: 1,
  type: 'requirement',
});
itemGraph.setEdge('water-bucket', 'simple-embergrain-plant', {
  min: 1,
  max: 1,
  type: 'requirement',
});

// Yield Edges
itemGraph.setEdge('simple-embergrain-plant', 'simple-embergrain-seed', {
  min: 1,
  max: 3,
  type: 'yield',
});
itemGraph.setEdge('simple-embergrain-plant', 'simple-embergrain', {
  min: 30,
  max: 50,
  type: 'yield',
});
itemGraph.setEdge('simple-embergrain-plant', 'simple-straw', {
  min: 0,
  max: 1,
  type: 'yield',
});

const pottersMix = planCraftingRequirements(itemGraph, 'basic-potters-mix', 8);
console.log(JSON.stringify(pottersMix, null, 2));

const embergrain = estimateInputForYields(itemGraph, 'simple-embergrain', 500);
console.log(JSON.stringify(embergrain, null, 2));
