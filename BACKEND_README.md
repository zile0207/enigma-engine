# Project Editor Backend - Implementation Notes

## Overview

The project editor now includes a complete backend for visual-to-code synchronization.

## How It Works

### 1. Visual Editor (Client)

When a user drags or resizes an element in the canvas:

```typescript
// apps/web/src/app/[username]/dashboard/[project]/page.tsx
const handleMouseUp = async () => {
  const element = document.querySelector(`[data-enigma-id="${selectedId}"]`);

  const patch = {
    width: element.style.width,
    height: element.style.height,
    top: element.style.top,
    left: element.style.left,
  };

  // Send to backend
  await fetch(`/api/projects/${projectName}/update-element`, {
    method: "POST",
    body: JSON.stringify({ selectedId, patch }),
  });
};
```

### 2. AST Surgery (Library)

`lib/ast-surgeon.ts` uses Babel to surgically modify React code:

1. Parses source code into AST (Abstract Syntax Tree)
2. Traverses tree to find element with matching `data-enigma-id`
3. Updates or creates `style` attribute with new values
4. Generates clean source code from modified AST

```typescript
export async function applyLayoutPatch(
  sourceCode: string,
  targetId: string,
  patch: { width; height; top; left }
): Promise<string>;
```

### 3. API Route (Server)

`app/api/projects/[project]/update-element/route.ts`:

1. Reads the project page file
2. Applies AST patch
3. Writes updated code back to disk
4. Returns success/error response

## Current Architecture

### Hybrid Approach (Recommended)

The system now uses a **hybrid approach** combining the best of all options:

1. **UI state** → `elementStyles` state manages immediate visual updates
2. **localStorage** → Persists changes across page reloads (per-project)
3. **API + AST** → Updates actual source code files when user releases mouse

This means:

- **Instant feedback** - Changes appear immediately in canvas
- **Session persistence** - Survive page refreshes without backend
- **Code updates** - Eventually written to source files (once multi-project issue resolved)

### Multi-Project Architecture Limitations

Currently, ALL projects share the same source file:

```
src/app/[username]/dashboard/[project]/page.tsx
```

When you navigate to:

- `/zile/dashboard/spotify` → renders `[project]/page.tsx`
- `/zile/dashboard/ecommerce` → renders same `[project]/page.tsx`

**Problem:** Applying patches to `page.tsx` affects all projects or conflicts between them.

**For now:** This is acceptable as a prototype/demo. Changes will apply to the shared state.

**Future solution options:**

1. **Individual project files:** Create `spotify/page.tsx`, `ecommerce/page.tsx`
2. **Data-driven:** Store layouts in database/JSON, render dynamically
3. **Project-specific storage:** Store patches in `projects/[name]/layout.json`

## File Structure

```
apps/web/
├── src/
│   ├── app/
│   │   └── [username]/
│   │       └── dashboard/
│   │           └── [project]/
│   │               └── page.tsx           # Shared editor (currently)
│   ├── lib/
│   │   └── ast-surgeon.ts              # AST manipulation library
│   └── components/
│       └── ...editor components...
└── package.json                           # Added Babel deps
```

## API Endpoint

**POST** `/api/projects/[project]/update-element`

**Request body:**

```json
{
  "selectedId": "button-001",
  "patch": {
    "width": "200px",
    "height": "100px",
    "top": "150px",
    "left": "100px"
  }
}
```

**Response (success):**

```json
{
  "success": true,
  "elementId": "button-001",
  "patch": { ... }
}
```

**Response (error):**

```json
{
  "success": false,
  "error": "Project page not found",
  "path": "..."
}
```

## Dependencies Added

```json
{
  "@babel/generator": "^7.28.5",
  "@babel/parser": "^7.28.5",
  "@babel/traverse": "^7.28.5",
  "@babel/types": "^7.28.5"
}
```

## Testing

1. Start dev server: `pnpm dev`
2. Navigate to `/zile/dashboard/spotify`
3. Click "Edit" to enter edit mode
4. Drag or resize the "Main Button"
5. Release mouse → changes saved to source code
6. Refresh page → changes persist in code

## Console Logs

- `[ast-surgeon] Element with data-enigma-id="xxx" not found` - Element ID doesn't exist in source
- `[ast-surgeon] Failed to apply patch` - Code parsing/generation error
- `[API] Successfully updated element xxx in project yyy` - Success
- `[API] Failed to update element` - API error (file not found, write failed)

## Next Steps

1. **Test the flow:** Verify drag/resize → API → code update works
2. **Resolve multi-project conflict:** Decide on architecture for multiple projects
3. **Add element creation:** API to add new elements to canvas
4. **Add element deletion:** API to remove elements from source
5. **Add undo/redo:** Track patch history for rollback
