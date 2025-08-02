import { Graph } from '@dagrejs/graphlib';

const itemGraph = new Graph({ directed: true, compound: false });

itemGraph.setNode('rough-stone-chunk', 'Rough Stone Chunk');
itemGraph.setNode('rough-pebble', 'Rough Pebble');
itemGraph.setEdge('rough-stone-chunk', 'rough-pebble', {
  min: 8,
  max: 20,
  type: 'yield',
});

itemGraph.setNode('basic-clay', 'Basic Clay Lump');
itemGraph.setNode('basic-potters-mix', 'Basic Potters Mix');
itemGraph.setEdge('basic-clay', 'basic-potters-mix', {
  min: 2,
  max: 2,
  type: 'requirement',
});
itemGraph.setEdge('rough-pebble', 'basic-potters-mix', {
  min: 5,
  max: 5,
  type: 'requirement',
});

interface RequirementNode {
  id: string;
  label?: string;
  min: number;
  max: number;
  inputs: Record<string, RequirementNode>;
}

function computeRequirementTree(
  g: Graph,
  target: string,
  quantity: number,
  quantityMax: number = quantity
): RequirementNode {
  const inEdges = g.inEdges(target) ?? [];

  const label = g.node(target) ?? target; // fallback to Id if no label

  if (inEdges.length === 0) {
    // Leaf node
    return { id: target, label, min: quantity, max: quantityMax, inputs: {} };
  }

  const inputs: Record<string, RequirementNode> = {};

  for (const edge of inEdges) {
    const { v: inputNode } = edge;
    const edgeData = g.edge(edge);

    if (!edgeData || edgeData.min === undefined || edgeData.max === undefined) {
      throw new Error(`Missing min/max on edge from ${inputNode} to ${target}`);
    }

    let inputMin: number;
    let inputMax: number;

    if (edgeData.type === 'requirement') {
      inputMin = edgeData.min * quantity;
      inputMax = edgeData.max * quantityMax;
    } else if (edgeData.type === 'yield') {
      inputMin = Math.ceil(quantity / edgeData.max);
      inputMax = Math.ceil(quantityMax / edgeData.min);
    } else {
      throw new Error(`Unknown edge type: ${edgeData.type}`);
    }

    // Recurse into the input node
    inputs[inputNode] = computeRequirementTree(
      g,
      inputNode,
      inputMin,
      inputMax
    );
  }

  return {
    id: target,
    label,
    min: quantity,
    max: quantityMax,
    inputs,
  };
}

const tree = computeRequirementTree(itemGraph, 'basic-potters-mix', 8);
console.log(JSON.stringify(tree, null, 2));
