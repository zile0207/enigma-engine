// Fix for drag/resize bug in project editor

## The Problem

There's a **race condition** causing drag/resize to not work:

1. **Direct DOM manipulation** (lines 128-131 in original code):
```typescript
element.style.width = `${newWidth}px`;
element.style.height = `${newHeight}px`;
element.style.left = `${newLeft}px`;
element.style.top = `${newTop}px`;
```

2. **React state update** (lines 141-149):
```typescript
setElementStyles(prev => ({
  ...prev,
  [selectedId]: {
    top: `${newTop}px`,
    left: `${newLeft}px`,
    width: `${newWidth}px`,
    height: `${newHeight}px`,
  },
}));
```

3. **React re-render**: After state updates, React re-renders and applies `elementStyles` to the button, **overwriting the direct DOM changes**

4. **Selection box with `position: fixed`**: Blocks mouse events to the canvas

## The Fix

In `/apps/web/src/app/[username]/dashboard/[project]/page.tsx`:

### 1. Remove direct DOM manipulation (lines 128-131)
DELETE these lines - they're causing the race:
```typescript
// DELETE THIS:
element.style.width = `${newWidth}px`;
element.style.height = `${newHeight}px`;
element.style.left = `${newLeft}px`;
element.style.top = `${newTop}px`;

// KEEP THIS (state update only):
setElementStyles(prev => ({
  ...prev,
  [selectedId]: {
    top: `${newTop}px`,
    left: `${newLeft}px`,
    width: `${newWidth}px`,
    height: `${newHeight}px`,
  },
}));
```

### 2. Fix selection box positioning (line ~330)
Change from `position: fixed` to `position: absolute`:
```typescript
// BEFORE (blocks canvas):
<div style={{
  position: "fixed",
  top: selectedElement.top,
  left: selectedElement.left,
  pointerEvents: "none",
}}>

// AFTER (relative to canvas):
<div style={{
  position: "absolute",
  top: `${selectedElement.top - canvasRef.current?.getBoundingClientRect().top}px`,
  left: `${selectedElement.left - canvasRef.current?.getBoundingClientRect().left}px`,
  width: selectedElement.width,
  height: selectedElement.height,
  pointerEvents: "none",
  zIndex: 9999, // High z-index to show handles
}}>
```

### 3. Keep selection box pointerEvents as "none"
The selection box should have `pointerEvents: "none"` (already there) so it doesn't block canvas interactions.

## Result

After these changes:
- ✅ Drag/resize updates state
- ✅ React re-renders button with new styles
- ✅ Selection box follows element (absolute position in canvas)
- ✅ Canvas receives mouse events (no fixed overlay blocking them)
- ✅ Resize handles can still be clicked (they're children of selection box)
