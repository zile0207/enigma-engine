import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ThemesPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Themes</h1>
      <p className="text-muted-foreground mb-8">Customize your design system</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-slate-900 rounded-lg mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dark</h3>
          <p className="text-sm text-muted-foreground mb-4">Dark color scheme</p>
          <Button variant="outline" className="w-full">Preview</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-slate-50 rounded-lg mb-4" />
          <h3 className="text-lg font-semibold mb-2">Light</h3>
          <p className="text-sm text-muted-foreground mb-4">Light color scheme</p>
          <Button variant="outline" className="w-full">Preview</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-blue-500">
          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4" />
          <h3 className="text-lg font-semibold mb-2">Enigma</h3>
          <p className="text-sm text-muted-foreground mb-4">Current theme</p>
          <Button className="w-full">Active</Button>
        </Card>
      </div>
    </div>
  );
}
