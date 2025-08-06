import { createEmptyItemGraph, computeRequirementTree } from './graph';

const itemGraph = createEmptyItemGraph();

itemGraph.setNode('rough-stone-chunk', 'Rough Stone Chunk');
itemGraph.setNode('rough-pebble', 'Rough Pebble');
itemGraph.setEdge('rough-stone-chunk', 'rough-pebble', {
  min: 7,
  max: 19,
  type: 'yield',
});

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

const tree = computeRequirementTree(itemGraph, 'basic-potters-mix', 8);
console.log(JSON.stringify(tree, null, 2));
