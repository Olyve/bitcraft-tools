export type NodeType = 'craftable' | 'gatherable';

export enum Tier {
  T0 = 0,
  T1 = 1,
  T2 = 2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
}

export type Ingredient = {
  id: string; // references another ItemNode
  quantity: number;
};

export type ItemNode = {
  id: string;
  displayName: string;
  tier: Tier;
  type: NodeType;
};
