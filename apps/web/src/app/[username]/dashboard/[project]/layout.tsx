"use client";

import { TabLayout } from "@/components/tab-layout";
import { useTabStore } from "@/store/useTabStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string; project: string }>;
}) {
  const openTab = useTabStore((state) => state.openTab);
  const setActiveTab = useTabStore((state) => state.setActiveTab);
  const pathname = usePathname();

  useEffect(() => {
    // Open the project tab when this layout is loaded
    params.then(({ username, project }) => {
      const tabId = `project-${project}`;
      openTab({
        id: tabId,
        name: project,
        type: "project",
        path: `/${username}/dashboard/${project}`,
      });
      // Set as active tab
      setActiveTab(tabId);
    });
  }, [openTab, setActiveTab, params]);

  return <TabLayout>{children}</TabLayout>;
}
