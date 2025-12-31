import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ComponentsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Components</h1>
      <p className="text-muted-foreground mb-8">Browse and manage your components</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Button</h3>
          <p className="text-sm text-muted-foreground mb-4">Primary action component</p>
          <Button>Example</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Input</h3>
          <p className="text-sm text-muted-foreground mb-4">Form input component</p>
          <input
            type="text"
            placeholder="Type here..."
            className="w-full px-4 py-2 border border-input rounded-md"
          />
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Card</h3>
          <p className="text-sm text-muted-foreground mb-4">Content container</p>
          <div className="bg-slate-100 p-4 rounded-md">
            Card content
          </div>
        </Card>
      </div>
    </div>
  );
}
