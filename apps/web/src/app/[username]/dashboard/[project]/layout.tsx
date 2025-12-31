"use client";

import { TabLayout } from "@/components/tab-layout";
import { useTabStore } from "@/store/useTabStore";
import { useEffect, useRef } from "react";
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
  const paramsRef =
    useRef<Promise<{ username: string; project: string }>>(params);

  useEffect(() => {
    paramsRef.current = params;

    params.then(({ username, project }) => {
      // Only process if this is still the current params promise
      if (paramsRef.current === params) {
        const tabId = `project-${project}`;
        openTab({
          id: tabId,
          name: project,
          type: "project",
          path: `/${username}/dashboard/${project}`,
        });
        setActiveTab(tabId);
      }
    });
  }, [params, openTab, setActiveTab]);

  return <TabLayout>{children}</TabLayout>;
}
