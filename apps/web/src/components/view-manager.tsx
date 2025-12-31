"use client";

import { useTabStore } from "@/store/useTabStore";
import { useEffect, useState } from "react";

interface ViewManagerProps {
  children: React.ReactNode;
}

export function ViewManager({ children }: ViewManagerProps) {
  const { openTabs, activeTabId } = useTabStore();
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(new Set(["home"]));

  // When a tab is opened, mark it as mounted
  useEffect(() => {
    const newMountedTabs = new Set(mountedTabs);
    openTabs.forEach((tab) => {
      newMountedTabs.add(tab.id);
    });
    setMountedTabs(newMountedTabs);
  }, [openTabs]);

  return (
    <div className="w-full h-full">
      {openTabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isMounted = mountedTabs.has(tab.id);

        if (!isMounted) return null;

        return (
          <div
            key={tab.id}
            style={{
              display: isActive ? "block" : "none",
            }}
            className="w-full h-full"
            data-tab-id={tab.id}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
}
