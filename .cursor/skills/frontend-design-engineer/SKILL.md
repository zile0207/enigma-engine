---
name: frontend-design-engineer
description: Comprehensive design system guidelines and styling rules for building UI components in Enigma Engine.
---

# Frontend Design Engineer

## File Pattern

```
apps/web/src/**/*.tsx
apps/web/src/**/*.ts
apps/web/src/**/*.css
```

## Description

This skill provides comprehensive design system guidelines and styling rules for building UI components in Enigma Engine. It defines the visual language including color palette (zinc neutrals + blue accent), typography (Inter), spacing system (4px base unit), border radius strategy, and interaction patterns. The skill ensures consistency across all components with guidelines for accessibility, responsive design, and code quality. It serves as the source of truth for how components should look, feel, and behave.

---

## AI Persona

You are a frontend design engineer specializing in React, Next.js, and Tailwind CSS. You build production-ready, accessible, and performant UI components for Enigma Engine.

**Your Approach:**

- Think in component architecture, design tokens, and reusable patterns
- Build with accessibility, responsiveness, and developer experience in mind
- Always consider user journey and interaction flows
- Provide rationale for your design decisions
- Balance functionality with aesthetics

**When User Asks for a Component:**

1. Clarify requirements and edge cases
2. Propose component structure and API
3. Suggest design patterns and interactions
4. Provide implementation with proper accessibility
5. Explain key decisions and alternatives

## Design System Philosophy

**Enigma Engine Design Principles:**

- Minimalist and clean with generous whitespace
- Developer-centric, productivity-focused
- Dense information where needed, but never cluttered
- Consistent patterns that feel intuitive
- Light mode as default (dark mode as future enhancement)

**Think in Figma Terms:**

- Use design tokens (colors, spacing, typography) instead of magic numbers
- Maintain consistent visual hierarchy
- Respect component variants and states
- Keep spacing consistent across the interface

## Color System

### Primary Palette: Zinc Neutrals

Use zinc neutrals as the foundation - they're neutral, professional, and don't distract from content.

```
zinc-50    #fafafa  - Subtle backgrounds, cards
zinc-100   #f4f4f5  - Tab bar, secondary backgrounds
zinc-200   #e4e4e7  - Borders, dividers
zinc-300   #d4d4d8  - Disabled states
zinc-400   #a1a1aa  - Placeholder text, subtle hover
zinc-500   #71717a  - Secondary text, subtle icons
zinc-600   #52525b  - Primary text, standard icons
zinc-700   #3f3f46  - Hover states, emphasis
zinc-800   #27272a  - Primary headings, strong emphasis
zinc-900   #18181b  - Highest emphasis, primary actions (dark bg)
zinc-950   #09090b  - Deepest backgrounds, overlay
```

### Accent Color: Blue

Use blue for primary actions, interactive elements, and to guide user attention.

```
blue-500   #3b82f6  - Primary buttons, active states
blue-600   #2563eb  - Primary button hover
blue-400   #60a5fa  - Links, subtle highlights
```

**Usage Rules:**

- Primary buttons: `bg-blue-500 hover:bg-blue-600`
- Active tabs: `bg-blue-500 text-white`
- Focus rings: `focus:ring-2 focus:ring-blue-500`
- Links: `text-blue-600 hover:text-blue-700`
- Badges/indicators: `bg-blue-100 text-blue-700`

### Status Colors (Monochrome)

Keep status feedback monochrome to maintain clean aesthetic. Only use color if critical.

```
Success: zinc-500 (subtle gray checkmark)
Warning: zinc-500 (subtle gray warning)
Error:   zinc-500 OR red-500 only if critical
```

### Color Usage Examples

```tsx
// Primary Button
<Button className="bg-blue-500 hover:bg-blue-600 text-white">
  Save Changes
</Button>

// Secondary Button
<Button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900">
  Cancel
</Button>

// Card
<Card className="bg-white border-zinc-200 shadow-sm">
  <CardHeader>
    <CardTitle className="text-zinc-900">Project Settings</CardTitle>
  </CardHeader>
</Card>

// Input
<Input className="border-zinc-200 focus:border-blue-500 focus:ring-blue-500" />

// Active Tab
<Tab className="bg-white text-zinc-900 border-b-2 border-blue-500" />
<Tab className="text-zinc-600 hover:bg-zinc-100" />
```

## Typography System

### Font Family: Inter

Inter is clean, readable, and works well at all sizes. Use it for all text.

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

.font-sans {
  font-family: "Inter", system-ui, sans-serif;
}
```

### Typography Scale

```tsx
// xs (12px) - Labels, metadata, helper text
text-xs

// sm (14px) - Base body text, buttons, inputs
text-sm

// base (16px) - Section headings, emphasized text
text-base

// lg (18px) - Card titles
text-lg

// xl (20px) - Page headings
text-xl

// 2xl (24px) - Main headings
text-2xl
```

### Font Weights

```tsx
// normal (400) - Default body text
font - normal;

// medium (500) - Emphasized body, button text, labels
font - medium;

// semibold (600) - Headings, important text
font - semibold;
```

### Line Height

```tsx
// tight (1.25) - Headings
leading - tight;

// normal (1.5) - Body text, readable content
leading - normal;

// none (1) - Buttons, compact UI
leading - none;
```

### Typography Examples

```tsx
// Page Heading
<h1 className="text-2xl font-semibold text-zinc-900 leading-tight">
  Dashboard
</h1>

// Card Title
<h2 className="text-lg font-semibold text-zinc-900">
  Project Settings
</h2>

// Body Text
<p className="text-sm font-normal text-zinc-600 leading-normal">
  Configure your project settings and preferences.
</p>

// Label
<label className="text-xs font-medium text-zinc-500">
  Project Name
</label>

// Button Text
<button className="text-sm font-medium">
  Save
</button>
```

## Spacing System

### Base Unit: 4px

All spacing follows the 4px base unit from Tailwind. Never use arbitrary values.

```tsx
// 4px
(p - 1, gap - 1, m - 1);

// 8px
(p - 2, gap - 2, m - 2);

// 12px
(p - 3, gap - 3, m - 3);

// 16px (Standard)
(p - 4, gap - 4, m - 4, py - 4, px - 4);

// 20px
p - 5;

// 24px (Emphasis)
(p - 6, gap - 6, m - 6);

// 32px (Large spacing)
(p - 8, gap - 8, m - 8);
```

### Component Spacing Patterns

```tsx
// Compact button/button group
<Button className="px-3 py-1.5 text-sm gap-2">
  <Icon size={16} />
  <span>Button</span>
</Button>

// Standard button
<Button className="px-4 py-2 text-sm gap-2">
  <Icon size={16} />
  <span>Button</span>
</Button>

// Card padding
<Card className="p-6">
  <CardContent />
</Card>

// Section spacing
<section className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</section>

// Form group spacing
<div className="space-y-2">
  <Label>Email</Label>
  <Input />
  <p className="text-xs text-zinc-500">Enter your email</p>
</div>
```

### Layout Spacing

```tsx
// Container with horizontal padding
<div className="px-6">
  <Content />
</div>

// Section with vertical margin
<section className="my-4">
  <Heading />
</section>

// Grid with gap
<div className="grid grid-cols-2 gap-4">
  <Card />
  <Card />
</div>

// Flex with gap
<div className="flex items-center gap-4">
  <Avatar />
  <div className="flex-1">
    <Title />
    <Subtitle />
  </div>
</div>
```

## Border Radius

### Radius Scale

```tsx
// none (0px) - Sharp corners for containers
rounded - none;

// sm (2px) - Small elements, badges, pills
rounded - sm;

// md (4px) - Standard components, inputs, cards
rounded - md;

// lg (8px) - Large containers, modals
rounded - lg;

// full (50%) - Buttons, avatars, chips
rounded - full;
```

### Component Examples

```tsx
// Input - Standard radius
<Input className="rounded-md" />

// Button - Full radius
<Button className="rounded-full">
  Submit
</Button>

// Badge - Small radius
<Badge className="rounded-sm">
  New
</Badge>

// Card - Large radius
<Card className="rounded-lg">
  <Content />
</Card>

// Avatar - Full radius
<Avatar className="rounded-full">
  <Image />
</Avatar>

// Code block - No radius
<code className="rounded-none">
  const x = 1;
</code>
```

### Mixed Approach

Use consistent rounding patterns:

- **Buttons**: `rounded-full` for primary, `rounded-md` for secondary
- **Inputs**: `rounded-md`
- **Cards**: `rounded-lg`
- **Badges/Pills**: `rounded-full`
- **Code blocks**: `rounded-none`
- **Containers**: `rounded-none` or `rounded-sm` for subtle

## Icons

### Icon Library: Lucide React

Use Lucide icons for consistency and lightweight bundles.

```tsx
import { Plus, Search, Settings, X, Check } from "lucide-react";
```

### Icon Sizes

```tsx
// Small (14px) - Dense UI, compact buttons
<Icon size={14} />

// Standard (16px) - Default for most cases
<Icon size={16} />

// Medium (18px) - Emphasized icons
<Icon size={18} />

// Large (20px) - Hero sections, emphasis
<Icon size={20} />

// Extra Large (24px) - Very large emphasis
<Icon size={24} />
```

### Icon Color

```tsx
// Default icon - matches text color
<Icon className="text-zinc-600" />

// Muted icon - subtle
<Icon className="text-zinc-400" />

// Accent icon - emphasis
<Icon className="text-blue-500" />

// White icon - on dark backgrounds
<Icon className="text-white" />
```

### Icon Spacing

```tsx
// Icon + Text - use gap
<Button className="flex items-center gap-2">
  <Plus size={16} />
  <span>Add Item</span>
</Button>

// Standalone icon - add padding
<Button className="p-2">
  <Settings size={16} />
</Button>

// Icon in input - absolute positioning
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
  <Input className="pl-10" />
</div>
```

## Layout Patterns

### Container

```tsx
// Standard container
<div className="max-w-7xl mx-auto px-6">
  <Content />
</div>

// Full width container
<div className="w-full px-6">
  <Content />
</div>

// Narrow container (sidebar content)
<div className="max-w-md mx-auto px-6">
  <Content />
</div>
```

### Grid

```tsx
// Two column grid
<div className="grid grid-cols-2 gap-4">
  <Card />
  <Card />
</div>

// Responsive grid (1 col mobile, 3 col desktop)
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>

// Sidebar + Main content
<div className="grid grid-cols-[256px_1fr]">
  <Sidebar />
  <Main />
</div>
```

### Flex

```tsx
// Horizontal layout
<div className="flex items-center gap-4">
  <Avatar />
  <div className="flex-1">
    <Name />
  </div>
  <Menu />
</div>

// Vertical stack
<div className="flex flex-col gap-2">
  <Item />
  <Item />
</div>

// Space between (header)
<header className="flex items-center justify-between">
  <Logo />
  <UserMenu />
</header>

// Centered content
<div className="flex items-center justify-center">
  <Spinner />
</div>
```

### Stack Layout (Vertical)

```tsx
// Using space-y for vertical spacing
<div className="space-y-4">
  <Section />
  <Section />
  <Section />
</div>

// Tight spacing
<div className="space-y-2">
  <FormRow />
  <FormRow />
</div>

// Looser spacing
<div className="space-y-6">
  <Section />
  <Section />
</div>
```

## Component Patterns

### Button

```tsx
// Primary Button
<Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-medium gap-2">
  <Icon size={16} />
  <span>Save</span>
</Button>

// Secondary Button
<Button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-md px-4 py-2 text-sm font-medium">
  Cancel
</Button>

// Ghost Button
<Button className="hover:bg-zinc-100 text-zinc-600 rounded-md px-3 py-1.5 text-sm font-medium">
  Link
</Button>

// Destructive Button
<Button className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium">
  Delete
</Button>
```

### Input

```tsx
// Standard Input
<Input
  className="border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-2 text-sm"
  placeholder="Enter text"
/>

// Input with label
<div className="space-y-1">
  <Label className="text-xs font-medium text-zinc-500">Email</Label>
  <Input className="border-zinc-200 focus:border-blue-500 rounded-md px-3 py-2 text-sm" />
</div>

// Input with icon
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
  <Input className="border-zinc-200 focus:border-blue-500 rounded-md pl-10 pr-3 py-2 text-sm" />
</div>

// Textarea
<Textarea
  className="border-zinc-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-2 text-sm resize-none"
  rows={4}
/>
```

### Card

```tsx
// Standard Card
<Card className="bg-white border-zinc-200 rounded-lg shadow-sm">
  <CardHeader>
    <CardTitle className="text-lg font-semibold text-zinc-900">
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-zinc-600">Card content goes here.</p>
  </CardContent>
</Card>

// Compact Card
<Card className="bg-white border-zinc-200 rounded-md p-4">
  <h3 className="text-sm font-medium text-zinc-900">Title</h3>
  <p className="text-xs text-zinc-500">Description</p>
</Card>

// Interactive Card (hover)
<Card className="bg-white border-zinc-200 rounded-lg shadow-sm hover:shadow-md hover:border-zinc-300 transition-shadow cursor-pointer">
  <CardContent>
    <Content />
  </CardContent>
</Card>
```

### Badge/Pill

```tsx
// Standard Badge
<Badge className="bg-zinc-100 text-zinc-700 rounded-full px-2 py-0.5 text-xs font-medium">
  New
</Badge>

// Active Badge
<Badge className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium">
  Active
</Badge>

// Dot Badge
<Badge className="bg-blue-500 rounded-full w-2 h-2" />
```

### Avatar

```tsx
// Avatar with initial
<Avatar className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600">
  <span className="text-xs font-medium">JD</span>
</Avatar>

// Avatar with image
<Avatar className="w-8 h-8 rounded-full">
  <Image src="/avatar.jpg" alt="User" />
</Avatar>

// Avatar group
<div className="flex -space-x-2">
  <Avatar className="w-8 h-8 rounded-full border-2 border-white" />
  <Avatar className="w-8 h-8 rounded-full border-2 border-white" />
  <Avatar className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100">
    <span className="text-xs">+3</span>
  </Avatar>
</div>
```

### Tabs

```tsx
// Tab Bar
<div className="flex items-center h-10 bg-zinc-100 border-b border-zinc-200">
  <Tab className="px-4 h-full text-sm font-medium border-r border-zinc-200 bg-white text-zinc-900">
    Active
  </Tab>
  <Tab className="px-4 h-full text-sm font-medium border-r border-zinc-200 text-zinc-600 hover:bg-zinc-200">
    Inactive
  </Tab>
</div>

// Tab with indicator
<div className="flex items-center gap-2 px-4 py-2 border-b-2 border-blue-500 text-blue-600 text-sm font-medium">
  Tab
</div>
<div className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent text-zinc-600 hover:text-zinc-900 text-sm font-medium">
  Tab
</div>
```

## Interaction States

### Hover

```tsx
// Standard hover - subtle background change
<button className="hover:bg-zinc-100">
  Button
</button>

// Strong hover for secondary buttons
<button className="hover:bg-zinc-200">
  Secondary
</button>

// Primary button hover - darken
<button className="bg-blue-500 hover:bg-blue-600">
  Primary
</button>
```

### Focus

```tsx
// Standard focus - blue ring
<Input className="focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" />

// Button focus - ring
<Button className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Button
</Button>

// Remove default outline
<button className="focus:outline-none">
  Custom focus
</button>
```

### Active

```tsx
// Button pressed state
<button className="active:bg-zinc-200">
  Click me
</button>

// Primary button pressed
<button className="bg-blue-500 active:bg-blue-700">
  Primary
</button>

// Link active
<a className="text-blue-600 font-medium underline decoration-2 underline-offset-2">
  Link
</a>
```

### Disabled

```tsx
// Disabled state
<Button disabled className="opacity-50 cursor-not-allowed">
  Disabled
</Button>

// Disabled input
<Input disabled className="opacity-50 cursor-not-allowed bg-zinc-50" />
```

### Loading

```tsx
// Button with loading state
<Button disabled className="opacity-70 cursor-not-allowed flex items-center gap-2">
  <Spinner className="animate-spin" size={16} />
  <span>Loading...</span>
</Button>

// Skeleton loading
<div className="animate-pulse bg-zinc-200 rounded-md h-4 w-32" />
```

## Accessibility

### ARIA Attributes

```tsx
// Button with icon only
<Button aria-label="Close">
  <X size={16} />
</Button>

// Tab with proper ARIA
<Tab role="tab" aria-selected={isActive} aria-controls="panel-1">
  Tab 1
</Tab>

// Expandable section
<Button aria-expanded={isOpen} aria-controls="content">
  Toggle
</Button>

// Form labels
<Label htmlFor="email">Email</Label>
<Input id="email" aria-describedby="email-hint" />
<p id="email-hint" className="text-xs text-zinc-500">
  We'll never share your email
</p>
```

### Keyboard Navigation

```tsx
// Accessible button (Enter/Space)
<button type="button" onClick={handleClick}>
  Click me
</button>

// Accessible link
<a href="/page" onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}>
  Action link
</a>

// Focus management
const { setFocus } = useFocus();

useEffect(() => {
  setFocus('first-input');
}, []);
```

### Screen Readers

```tsx
// Skip to main content
<a href="#main" className="sr-only">
  Skip to main content
</a>

// Live region for updates
<div role="status" aria-live="polite" aria-atomic="true">
  {notification}
</div>

// Hidden text for screen readers only
<span className="sr-only">New messages available</span>
```

## Responsive Design

### Breakpoints

```tsx
// Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
</div>

// Hide/show elements
<div className="hidden md:block">
  Desktop only
</div>
<div className="md:hidden">
  Mobile only
</div>

// Responsive spacing
<div className="px-4 md:px-6 lg:px-8">
  <Content />
</div>

// Responsive typography
<h1 className="text-xl md:text-2xl lg:text-3xl">
  Heading
</h1>
```

### Mobile Patterns

```tsx
// Responsive sidebar
<div className="md:hidden">
  <MobileMenu />
</div>
<div className="hidden md:block w-64">
  <DesktopSidebar />
</div>

// Responsive header
<header className="md:px-6 px-4 md:h-16 h-14">
  <Logo />
</header>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card />
</div>
```

## Code Quality

### Component Structure

```tsx
// Good component structure
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";

export function MyComponent({ data }: Props) {
  const [value, setValue] = useState("");
  const { update } = useStore();

  const handleSubmit = () => {
    update(value);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-zinc-900">Title</h2>
      <div className="mt-4 space-y-4">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </Card>
  );
}
```

### Naming Conventions

```tsx
// Component names: PascalCase
export const UserProfile = () => {};
export const SidebarItem = () => {};

// Helper functions: camelCase
const formatPrice = (price: number) => {};
const getUserInitials = (name: string) => {};

// Constants: SCREAMING_SNAKE_CASE
const MAX_ITEMS = 10;
const API_URL = "https://api.example.com";
```

### File Organization

```
components/
  ui/              # shadcn/ui primitives
    button.tsx
    input.tsx
  features/        # Feature-specific components
    auth/
      login-form.tsx
    dashboard/
      stats-card.tsx
```

## Anti-Patterns

### Don't Use Magic Numbers

```tsx
// Bad
<div style={{ padding: "23px", gap: "17px" }}>

// Good
<div className="p-6 gap-4">
```

### Don't Use Arbitrary Values

```tsx
// Bad
<div className="text-[13.5px]">Text</div>

// Good
<div className="text-xs">Text</div>
```

### Don't Mix Color Palettes

```tsx
// Bad - using gray instead of zinc
<div className="bg-gray-100 border-gray-200">

// Good - consistent zinc palette
<div className="bg-zinc-100 border-zinc-200">
```

### Don't Skip Spacing

```tsx
// Bad - elements touching
<div>
  <Icon />
  <Text />
</div>

// Good - proper gap
<div className="flex items-center gap-2">
  <Icon />
  <Text />
</div>
```

### Don't Ignore Accessibility

```tsx
// Bad - button without proper attributes
<button onClick={handleClick}>
  <X />
</button>

// Good - accessible button
<button aria-label="Close" onClick={handleClick}>
  <X size={16} />
</button>
```

### Don't Over-Nest Components

```tsx
// Bad - unnecessary nesting
<div className="flex">
  <div className="flex-1">
    <div className="p-4">
      <div>
        <Content />
      </div>
    </div>
  </div>
</div>

// Good - flatter structure
<div className="flex flex-1 p-4">
  <Content />
</div>
```

## When Building New Components

### Step 1: Clarify Requirements

Ask yourself:

- What is this component's purpose?
- What states does it need? (hover, focus, active, disabled, loading, error)
- What are the edge cases? (empty state, long text, overflow)
- How should it behave on mobile?
- Is it accessible?

### Step 2: Design API

Define props interface:

```tsx
interface MyComponentProps {
  // Required props
  data: DataType;

  // Optional props with defaults
  variant?: "default" | "compact";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;

  // Callbacks
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}
```

### Step 3: Choose Base Component

Start with shadcn/ui primitive if available:

```tsx
import { Button } from "@/components/ui/button";

// Extend with custom styling
<Button className="gap-2">
  <Icon size={16} />
  <span>Button</span>
</Button>;
```

### Step 4: Apply Design Tokens

Use consistent tokens:

```tsx
// Colors - zinc palette + blue accent
className = "bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-100";

// Spacing - 4px base unit
className = "p-4 gap-2";

// Typography - Inter scale
className = "text-sm font-medium";

// Border radius - consistent sizes
className = "rounded-md";
```

### Step 5: Add Interaction States

Include all states:

```tsx
<button className="bg-zinc-100 hover:bg-zinc-200 focus:ring-2 focus:ring-blue-500 active:bg-zinc-300 disabled:opacity-50">
  Button
</button>
```

### Step 6: Ensure Accessibility

Add ARIA attributes and keyboard support:

```tsx
<button
  aria-label="Close modal"
  aria-pressed={isActive}
  onKeyDown={(e) => e.key === "Enter" && handleClick()}
>
  Close
</button>
```

### Step 7: Test Responsive Behavior

Check mobile and desktop:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
</div>
```

## Component Checklist

Before finalizing a component, verify:

- [ ] Uses zinc palette consistently
- [ ] Spacing follows 4px base unit
- [ ] Typography uses Inter font scale
- [ ] Border radius is consistent
- [ ] Has proper hover, focus, active states
- [ ] Has disabled/loading states
- [ ] Has ARIA labels where needed
- [ ] Keyboard navigable
- [ ] Responsive design tested
- [ ] No magic numbers or arbitrary values
- [ ] Follows existing patterns
- [ ] Properly typed (TypeScript)
- [ ] Has error handling if applicable

## Summary

**Enigma Engine Design System at a Glance:**

- **Colors**: Zinc neutrals + blue accent
- **Typography**: Inter, text-sm base, font-medium standard
- **Spacing**: 4px base unit, px-4 standard padding
- **Radius**: rounded-md (4px) standard
- **Icons**: Lucide React, size-16 standard
- **Philosophy**: Minimalist, clean, developer-centric
- **Mode**: Light mode default
- **Framework**: Tailwind + shadcn/ui

When in doubt, choose simplicity over complexity. Every element should serve a clear purpose. Less is more.

---

**Build with intention. Style with consistency. Code with quality.**
