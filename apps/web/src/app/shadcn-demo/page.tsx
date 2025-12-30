import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Menu, User, Settings, FileText } from "lucide-react";

export default function ShadcnDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            shadcn/ui Components
          </h1>
          <p className="text-muted-foreground mt-2">
            All components are working correctly
          </p>
        </div>

        <Separator />

        {/* Breadcrumb */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Breadcrumb</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Separator />

        {/* Buttons */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <Separator />

        {/* Badges */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <Separator />

        {/* Switch */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Switch</h2>
          <div className="flex items-center gap-4">
            <Switch id="switch1" />
            <label htmlFor="switch1" className="text-sm">
              Enable notifications
            </label>
          </div>
        </div>

        <Separator />

        {/* ScrollArea */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Scroll Area</h2>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <p className="text-sm">
                This is a scrollable area. Add more content to see the
                scrollbar.
              </p>
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 bg-muted rounded-lg"
                >
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Item {i + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      Description text here
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Navigation Menu */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Navigation Menu</h2>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px]">
                    <li>
                      <NavigationMenuLink className="flex select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <User className="h-4 w-4 mr-2" />
                        <div className="text-sm font-medium leading-none">
                          Introduction
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn how to use shadcn/ui components
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink className="flex select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <Settings className="h-4 w-4 mr-2" />
                        <div className="text-sm font-medium leading-none">
                          Button
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Displays a button or a component that looks like a
                          button
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <Separator />

        {/* Collapsible */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Collapsible</h2>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                <Menu className="mr-2 h-4 w-4" />
                Click to expand
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="rounded-md border p-4 bg-muted">
                <p className="text-sm">
                  This is the collapsible content area. You can put any content
                  here.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            All components rendered successfully with Tailwind v4
          </p>
          <Button asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
