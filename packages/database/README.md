# @enigma/database

Shared Supabase client and TypeScript types.

## Usage

```typescript
import { createSupabaseClient } from "@enigma/database";

const client = createSupabaseClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
```
