import { Graph } from '@dagrejs/graphlib';

interface RequirementNode {
  id: string;
  label?: string;
  min: number;
  max: number;
  inputs: Record<string, RequirementNode>;
}

export function computeRequirementTree(
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

export function createEmptyItemGraph(): Graph {
  return new Graph({ directed: true, compound: false });
}
