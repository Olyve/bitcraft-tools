import { Graph, GraphOptions } from '@dagrejs/graphlib';

type TraversalMode = 'requirements-only' | 'yields-only';
type EdgeType = 'requirement' | 'yield';

interface ComputeOptions {
  mode: TraversalMode;
  visited?: Set<string>;
}

interface EdgeData {
  type: EdgeType;
  min: number;
  max: number;
}

interface RequirementNode {
  id: string;
  label?: string;
  min: number;
  max: number;
  inputs: Record<string, RequirementNode>;
}

export function planCraftingRequirements(
  graph: Graph,
  target: string,
  quantity: number,
  quantityMax: number = quantity
): RequirementNode {
  return computeRequirementTree(graph, target, quantity, quantityMax, {
    mode: 'requirements-only',
  });
}

export function estimateInputForYields(
  graph: Graph,
  outputItem: string,
  desiredQuantity: number,
  maxQuantity: number = desiredQuantity
): RequirementNode {
  return computeRequirementTree(
    graph,
    outputItem,
    desiredQuantity,
    maxQuantity,
    { mode: 'yields-only' }
  );
}

function computeRequirementTree(
  g: Graph,
  target: string,
  quantity: number,
  quantityMax: number = quantity,
  options: ComputeOptions
): RequirementNode {
  const { visited = new Set(), mode } = options;

  if (visited.has(target)) {
    return {
      id: target,
      label: g.node(target) ?? target,
      min: quantity,
      max: quantityMax,
      inputs: {},
    };
  }

  visited.add(target);

  const inEdges = g.inEdges(target) ?? [];
  const label = g.node(target) ?? target; // fallback to Id if no label
  const inputs: Record<string, RequirementNode> = {};

  if (inEdges.length === 0) {
    // Leaf node
    return { id: target, label, min: quantity, max: quantityMax, inputs: {} };
  }

  for (const edge of inEdges) {
    const edgeData: EdgeData = g.edge(edge);
    if (!edgeData) continue;

    const shouldUse =
      (mode === 'requirements-only' && edgeData.type === 'requirement') ||
      (mode === 'yields-only' && edgeData.type === 'yield');

    if (!shouldUse) continue;

    const inputNode = edge.v;

    let inputMin: number;
    let inputMax: number;

    if (edgeData.type === 'requirement') {
      inputMin = edgeData.min * quantity;
      inputMax = edgeData.max * quantityMax;
    } else {
      // yield edge
      inputMin = Math.ceil(quantity / edgeData.max);
      inputMax = Math.ceil(quantityMax / edgeData.min);
    }

    // Recurse into the input node
    inputs[inputNode] = computeRequirementTree(
      g,
      inputNode,
      inputMin,
      inputMax,
      { mode, visited: new Set(visited) }
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
