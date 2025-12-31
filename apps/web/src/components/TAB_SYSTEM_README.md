# Tab System Documentation

## Overview

A complete tab management system for Enigma Engine with Zustand state persistence, URL synchronization, and keep-alive view management.

## Architecture

### 1. Zustand Store (`useTabStore.ts`)

The core state management store with:

- **Persistence**: Tabs and active tab are saved to localStorage
- **State**:
  - `openTabs`: Array of Tab objects
  - `activeTabId`: Currently selected tab ID
- **Actions**:
  - `openTab(tab)`: Opens a new tab (doesn't duplicate existing)
  - `closeTab(tabId)`: Closes a tab (can't close home)
  - `setActiveTab(tabId)`: Sets the active tab
  - `markDirty(tabId)`: Marks tab as unsaved
  - `markClean(tabId)`: Marks tab as saved
  - `updateTabName(tabId, name)`: Updates tab name
  - `closeAllTabs()`: Closes all except home
  - `closeOtherTabs(tabId)`: Closes all tabs except specified and home

### 2. View Manager (`view-manager.tsx`)

Keep-alive canvas that:
- Mounts all opened tabs but shows only the active one
- Uses `display: block/none` for instant switching
- Syncs active tab to URL `?file=id` parameter
- Preserves state when switching between tabs

### 3. Tab Bar (`tab-bar.tsx`)

The horizontal tab bar component with:
- **Home tab**: Always visible, leads to user's dashboard
- **Project tabs**: Dynamically opened projects
- **Plus button**: Opens new project creation UI
- **Close button**: X icon on each tab (except home)
- **Dirty indicator**: Orange dot for unsaved changes
- **Middle-click**: Closes tab
- **Right-click**: Closes other tabs

### 4. Tab Layout (`tab-layout.tsx`)

Wrapper component that provides:
- Tab bar at the top
- View manager for keep-alive functionality
- Proper spacing and layout

### 5. Navigation Hook (`useTabNavigation.ts`)

Helper hook for opening tabs from sidebar:
```typescript
const {
  openComponentTab,
  openProjectTab,
  openThemeTab,
  markTabDirty,
  markTabClean,
} = useTabNavigation();
```

## Usage

### Basic Setup

Wrap your page content with `TabLayout`:

```tsx
import { TabLayout } from "@/components/tab-layout";

export default function ProjectLayout({ children }) {
  return <TabLayout>{children}</TabLayout>;
}
```

### Opening Tabs from Sidebar

```tsx
import { useTabNavigation } from "@/hooks/useTabNavigation";

function Sidebar({ components }) {
  const { openComponentTab } = useTabNavigation();

  return (
    <ul>
      {components.map((comp) => (
        <li key={comp.id}>
          <button onClick={() =>
            openComponentTab(comp.name, `/projects/${project}/components/${comp.id}`)
          }>
            {comp.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Marking Tabs as Dirty

```tsx
import { useTabStore } from "@/store/useTabStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function ComponentEditor() {
  const pathname = usePathname();
  const { markDirty, markClean } = useTabStore();
  const [hasChanges, setHasChanges] = useState(false);

  const tabId = extractTabIdFromPath(pathname); // Your helper function

  useEffect(() => {
    if (hasChanges) {
      markDirty(tabId);
    } else {
      markClean(tabId);
    }
  }, [hasChanges, tabId, markDirty, markClean]);

  return <Editor onChange={(val) => setHasChanges(val !== initial)} />;
}
```

### Direct Store Access

```tsx
import { useTabStore } from "@/store/useTabStore";

function CustomComponent() {
  const { openTabs, activeTabId, openTab, closeTab } = useTabStore();

  return (
    <div>
      <p>Open tabs: {openTabs.length}</p>
      <p>Active: {activeTabId}</p>
      <button onClick={() => openTab({
        id: "unique-id",
        name: "New Tab",
        type: "component"
      })}>
        Open New Tab
      </button>
    </div>
  );
}
```

## Tab Object Structure

```typescript
interface Tab {
  id: string;        // Unique identifier (e.g., "project-my-project")
  name: string;      // Display name
  type: "home" | "project" | "component" | "theme";
  isDirty: boolean;  // Shows orange dot if true
  path?: string;     // Optional navigation path
}
```

## URL Synchronization

The system automatically syncs with URL query parameters:

- Active tab: `?file=tab-id`
- On page refresh, the correct tab stays active
- URL is updated using `history.replaceState` (no page reload)

## Features

1. **Persistent State**: Tabs survive page refreshes via localStorage
2. **URL Sync**: Active tab reflected in URL
3. **Keep-Alive**: Tabs don't unmount, preserving state
4. **Dirty Tracking**: Visual indicator for unsaved changes
5. **Fast Navigation**: Instant tab switching (no reload)
6. **Keyboard Shortcuts**: Middle-click to close, Escape to cancel input
7. **Context Menu**: Right-click to close other tabs

## Design System Alignment

- **Colors**: Slate-based neutrals (slate-100, slate-200, slate-900)
- **Indicators**: Orange-500 for dirty state
- **Icons**: Lucide React (Home, Plus, X)
- **Spacing**: Consistent px-4 padding, h-10 height
- **Typography**: text-sm for tabs, font-semibold for active
- **Interactions**: hover:bg-slate-200, transition-colors

## Future Enhancements

- Drag and drop tab reordering
- Tab grouping/collapsing
- Keyboard navigation (Ctrl+Tab, Ctrl+W)
- Custom tab colors per project
- Tab pinning
- Maximum tabs limit with overflow dropdown
