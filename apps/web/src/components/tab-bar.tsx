"use client";

import { usePathname, useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Tab {
  label: string;
  path: string;
  closable: boolean;
}

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Extract tabs from pathname
  const getTabs = (): Tab[] => {
    const tabs: Tab[] = [
      { label: "Home", path: "/zile/dashboard", closable: false },
    ];

    if (pathname.startsWith("/zile")) {
      if (pathname.includes("/dashboard")) {
        const parts = pathname.split("/").filter(Boolean);

        if (parts.length === 2 && parts[1] === "dashboard") {
          // /zile/dashboard
          tabs.push({
            label: "Projects",
            path: `/zile/dashboard`,
            closable: true,
          });
        } else if (parts.length === 3 && parts[2]) {
          // /zile/dashboard/project or /zile/dashboard/project/*
          const project = parts[2];
          tabs.push({
            label: project,
            path: `/zile/dashboard/${project}`,
            closable: true,
          });

          if (parts.length > 3 && parts[3]) {
            const sub = parts[3];
            tabs.push({
              label: `${sub.charAt(0).toUpperCase() + sub.slice(1)}`,
              path: pathname,
              closable: true,
            });
          }
        }
      }
    }

    return tabs;
  };

  const tabs = getTabs();
  const activeTab = tabs.find((tab) => tab.path === pathname);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      router.push(`/zile/dashboard/${newProjectName}`);
      setNewProjectName("");
      setShowNewProject(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-slate-100 border-b border-slate-200 flex items-center z-50">
      <div className="flex items-center h-full flex-1">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => router.push(tab.path)}
            className={`
              flex items-center gap-2 px-4 h-full text-sm font-medium
              border-r border-slate-200 min-w-[120px] max-w-[200px]
              hover:bg-slate-200 transition-colors
              ${
                activeTab?.path === tab.path
                  ? "bg-white text-slate-900 border-b-2 border-b-transparent relative"
                  : "text-slate-600"
              }
            `}
          >
            <span className="truncate">{tab.label}</span>
            {tab.closable && (
              <X
                size={14}
                className="opacity-0 group-hover:opacity-100 hover:bg-slate-300 rounded transition-opacity ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (tab.label === "Projects") {
                    router.push("/zile/dashboard");
                  } else {
                    router.push("/zile/dashboard");
                  }
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Plus button for new project */}
      {showNewProject ? (
        <div className="flex items-center gap-2 pr-4 h-full border-l border-slate-200 pl-4">
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
              }
            }}
            className="px-3 py-1 text-sm border border-slate-300 rounded w-48"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleCreateProject}
            disabled={!newProjectName.trim()}
          >
            Create
          </Button>
          <X
            size={16}
            className="cursor-pointer hover:text-slate-600"
            onClick={() => setShowNewProject(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center justify-center w-8 h-8 border-l border-slate-200 hover:bg-slate-200 transition-colors ml-2"
        >
          <Plus size={16} className="text-slate-600" />
        </button>
      )}
    </div>
  );
}
