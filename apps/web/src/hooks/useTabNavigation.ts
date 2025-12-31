import { useTabStore, Tab } from "@/store/useTabStore";
import { useRouter } from "next/navigation";

export function useTabNavigation() {
  const { openTab, setActiveTab, markDirty, markClean } = useTabStore();
  const router = useRouter();

  const openComponentTab = (componentName: string, componentPath: string) => {
    const tab: Omit<Tab, "isDirty"> = {
      id: `component-${componentName}`,
      name: componentName,
      type: "component",
      path: componentPath,
    };
    openTab(tab);
    router.push(componentPath);
  };

  const openProjectTab = (projectName: string, projectPath: string) => {
    const tab: Omit<Tab, "isDirty"> = {
      id: `project-${projectName}`,
      name: projectName,
      type: "project",
      path: projectPath,
    };
    openTab(tab);
    router.push(projectPath);
  };

  const openThemeTab = (themeName: string, themePath: string) => {
    const tab: Omit<Tab, "isDirty"> = {
      id: `theme-${themeName}`,
      name: themeName,
      type: "theme",
      path: themePath,
    };
    openTab(tab);
    router.push(themePath);
  };

  const markTabDirty = (tabId: string) => {
    markDirty(tabId);
  };

  const markTabClean = (tabId: string) => {
    markClean(tabId);
  };

  return {
    openComponentTab,
    openProjectTab,
    openThemeTab,
    markTabDirty,
    markTabClean,
  };
}
