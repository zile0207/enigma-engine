"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTabStore } from "@/store/useTabStore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ComponentsPage() {
  const pathname = usePathname();
  const { markDirty, markClean } = useTabStore();
  const [isDirty, setIsDirty] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Extract project name from path to find tab ID
  const parts = pathname.split("/").filter(Boolean);
  const projectName = parts[2];
  const tabId = `project-${projectName}`;

  // Sync dirty state with Zustand store
  useEffect(() => {
    if (isDirty) {
      markDirty(tabId);
    } else {
      markClean(tabId);
    }
  }, [isDirty, tabId, markDirty, markClean]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsDirty(value.length > 0);
  };

  const handleSave = () => {
    // Simulate saving
    console.log("Saving:", inputValue);
    setIsDirty(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Components</h1>
          <p className="text-muted-foreground">
            Browse and manage your components
          </p>
        </div>
        {isDirty && (
          <Button onClick={handleSave}>Save Changes</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Button</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Primary action component
          </p>
          <Button>Example</Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Input (Dirty State Demo)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Type to mark tab as dirty
          </p>
          <Input
            type="text"
            placeholder="Type to trigger dirty state..."
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full"
          />
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Card</h3>
          <p className="text-sm text-muted-foreground mb-4">Content container</p>
          <div className="bg-slate-100 p-4 rounded-md">Card content</div>
        </Card>
      </div>
    </div>
  );
}
