# @enigma/registry-schema

Zod schemas for validating component registry JSON.

## Usage

```typescript
import { registrySchema, type Registry } from "@enigma/registry-schema";

const data = {
  name: "my-registry",
  version: "1.0.0",
  components: []
};

const registry = registrySchema.parse(data);
```
