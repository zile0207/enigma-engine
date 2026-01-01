"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Home, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTabStore, Tab } from "@/store/useTabStore";
import { X } from "lucide-react";

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { openTabs, activeTabId, openTab, closeTab, setActiveTab } =
    useTabStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Sync URL with active tab on mount and when it changes
  useEffect(() => {
    // Try to determine active tab from pathname first
    const parts = pathname.split("/").filter(Boolean);
    let expectedTabId: string | null = null;

    // Check if we're on a project page
    if (parts.length >= 3 && parts[1] === "dashboard") {
      const project = parts[2];
      expectedTabId = `project-${project}`;
    } else if (parts.length === 2 && parts[1] === "dashboard") {
      // On dashboard page
      expectedTabId = "home";
    }

    // Only update if different to avoid loops
    if (expectedTabId && expectedTabId !== activeTabId) {
      const tabExists = openTabs.some((tab) => tab.id === expectedTabId);
      if (tabExists) {
        setActiveTab(expectedTabId);
      }
    }
  }, [pathname, activeTabId, openTabs, setActiveTab]);

  // Navigate to home tab
  const handleHomeClick = () => {
    setActiveTab("home");
    // Extract username from pathname and navigate to their dashboard
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 1) {
      router.push(`/${parts[0]}/dashboard`);
    } else {
      router.push("/dashboard");
    }
  };

  // Open new project tab
  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      // Create a URL-safe slug from the project name for ID
      const slug = newProjectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      // Validate slug is non-empty
      if (!slug) {
        alert("Project name must contain at least one letter or number");
        return;
      }

      const projectTab: Omit<Tab, "isDirty"> = {
        id: `project-${slug}`,
        name: newProjectName,
        type: "project",
        path: `/${pathname.split("/")[1]}/dashboard/${slug}`,
      };
      openTab(projectTab);
      setNewProjectName("");
      setShowNewProject(false);
    }
  };

  // Handle tab click
  const handleTabClick = (tab: Tab) => {
    // Just navigate - URL sync effect will set as active tab
    if (tab.path) {
      router.push(tab.path);
    }
  };

  // Handle closing a tab
  const handleCloseTab = (tabId: string) => {
    // Check if we're closing the active tab
    const isActiveTab = activeTabId === tabId;

    // Check if current URL matches the closed tab's path
    const tab = openTabs.find((t) => t.id === tabId);
    const isOnTabPage = tab?.path && pathname.startsWith(tab.path);

    // Navigate to home if closing active tab or if we're on that page
    if (isActiveTab || isOnTabPage) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length >= 1) {
        router.push(`/${parts[0]}/dashboard`);
      } else {
        router.push("/dashboard");
      }
    }

    // Close the tab
    closeTab(tabId);
  };

  // Handle middle-click to close tab
  const handleTabMiddleClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    handleCloseTab(tabId);
  };

  // Handle right-click for context menu (close others)
  const handleTabRightClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    // You could add a context menu here, for now we'll just close others
    const { closeOtherTabs } = useTabStore.getState();
    closeOtherTabs(tabId);
  };

  return (
    <div className="flex items-center h-10 bg-zinc-100 border-b border-zinc-200 select-none">
      {/* Home Tab - Always present */}
      <button
        onClick={handleHomeClick}
        className={`
          flex items-center gap-2 px-4 h-full text-sm font-medium
          border-r border-zinc-200
          hover:bg-zinc-200 transition-colors relative
          ${activeTabId === "home" ? "bg-white text-zinc-900" : "text-zinc-600"}
        `}
        data-tab-id="home"
      >
        <Home size={16} />
      </button>

      {/* Project Tabs - flex container that shrinks */}
      <div className="flex-1 h-10 flex items-center overflow-hidden">
        {openTabs
          .filter((tab) => tab.type !== "home")
          .map((tab) => (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              onAuxClick={(e) => {
                // Middle click (button 1) closes tab
                if (e.button === 1) {
                  handleTabMiddleClick(tab.id, e);
                }
              }}
              onContextMenu={(e) => handleTabRightClick(tab.id, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTabClick(tab);
                }
              }}
              className={`
                group flex items-center gap-2 pl-4 pr-2 h-full text-sm font-medium
                border-r border-zinc-200 hover:bg-zinc-200 transition-colors relative flex-shrink-0 cursor-pointer
                ${activeTabId === tab.id ? "bg-white text-zinc-900" : "text-zinc-600"}
              `}
              data-tab-id={tab.id}
            >
              {/* Tab name */}
              <span className="truncate">{tab.name}</span>

              {/* Unsaved indicator */}
              {tab.isDirty && (
                <span className="absolute top-2 left-2 w-1.5 h-1.5 bg-orange-500 rounded-full" />
              )}

              {/* Close button */}
              <div
                className="opacity-0 group-hover:opacity-100 ml-1 flex-shrink-0 h-6 w-6 p-0 flex items-center justify-center hover:bg-zinc-300 rounded transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
              >
                <X size={14} />
              </div>
            </div>
          ))}

        {/* Plus button for new project - always last after project tabs */}
        {showNewProject ? (
          <div className="flex items-center gap-2 pr-4 h-full border-l border-zinc-200 pl-4 flex-shrink-0">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateProject();
                } else if (e.key === "Escape") {
                  setShowNewProject(false);
                  setNewProjectName("");
                }
              }}
              className="px-3 py-1 text-sm border border-zinc-300 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
            >
              Create
            </button>
            <button
              className="h-6 w-6 p-0 flex items-center justify-center hover:bg-zinc-100 rounded transition-colors cursor-pointer"
              onClick={() => {
                setShowNewProject(false);
                setNewProjectName("");
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            className="h-full w-8 border-l border-zinc-200 rounded-none flex-shrink-0 flex items-center justify-center hover:bg-zinc-100 transition-colors cursor-pointer"
            onClick={() => setShowNewProject(true)}
            title="Create new project"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
