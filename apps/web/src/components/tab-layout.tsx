"use client";

import { TabBar } from "./tab-bar";
import { ViewManager } from "./view-manager";

interface TabLayoutProps {
  children: React.ReactNode;
}

export function TabLayout({ children }: TabLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      {/* Tab Bar */}
      <TabBar />

      {/* View Manager - Keep-alive canvas */}
      <div className="flex-1 overflow-auto">
        <ViewManager>{children}</ViewManager>
      </div>
    </div>
  );
}
