# bitcraft-tools

Utility functions and data for exploring crafting recipes in BitCraft.

## Installation

Install via npm:

```bash
npm install bitcraft-tools
```

## Usage

The package exports the item and recipe graphs along with helpers for
recursively calculating material requirements.

```ts
import { recipeGraph, itemGraph } from 'bitcraft-tools/item-graph';
import { getTotalInputs } from 'bitcraft-tools/traversal';

const totals = getTotalInputs('rough-brick', 27);
console.log(totals);
```

### Example traversal script

The `test.ts` script shows how to build and print a nested dependency
structure.
Run it with `ts-node` after installing the dependencies:

```bash
npx ts-node test.ts
```
