import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tab {
  id: string;
  name: string;
  type: "home" | "project" | "component" | "theme";
  isDirty: boolean;
  path?: string;
}

interface TabStore {
  openTabs: Tab[];
  activeTabId: string | null;

  // Actions
  openTab: (tab: Omit<Tab, "isDirty">) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  markDirty: (tabId: string) => void;
  markClean: (tabId: string) => void;
  updateTabName: (tabId: string, name: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (tabId: string) => void;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set, get) => ({
      openTabs: [
        {
          id: "home",
          name: "Home",
          type: "home",
          isDirty: false,
        },
      ],
      activeTabId: "home",

      openTab: (newTab) => {
        const { openTabs, activeTabId } = get();

        // Check if tab already exists
        const existingTab = openTabs.find((tab) => tab.id === newTab.id);
        if (existingTab) {
          // Tab exists, just activate it
          set({ activeTabId: newTab.id });
          return;
        }

        // Add new tab and activate it
        const updatedTabs = [...openTabs, { ...newTab, isDirty: false }];
        set({ openTabs: updatedTabs, activeTabId: newTab.id });
      },

      closeTab: (tabId) => {
        const { openTabs, activeTabId } = get();

        // Cannot close home tab
        if (tabId === "home") {
          return;
        }

        const updatedTabs = openTabs.filter((tab) => tab.id !== tabId);

        // If we're closing the active tab, switch to another one
        let newActiveTabId = activeTabId;
        if (activeTabId === tabId) {
          const currentIndex = openTabs.findIndex((tab) => tab.id === tabId);
          // Try to activate the tab before, otherwise the one after, otherwise home
          newActiveTabId =
            updatedTabs[currentIndex - 1]?.id ||
            updatedTabs[0]?.id ||
            "home";
        }

        set({ openTabs: updatedTabs, activeTabId: newActiveTabId });
      },

      setActiveTab: (tabId) => {
        const { openTabs } = get();
        const tabExists = openTabs.some((tab) => tab.id === tabId);
        if (tabExists) {
          set({ activeTabId: tabId });
        }
      },

      markDirty: (tabId) => {
        set((state) => ({
          openTabs: state.openTabs.map((tab) =>
            tab.id === tabId ? { ...tab, isDirty: true } : tab
          ),
        }));
      },

      markClean: (tabId) => {
        set((state) => ({
          openTabs: state.openTabs.map((tab) =>
            tab.id === tabId ? { ...tab, isDirty: false } : tab
          ),
        }));
      },

      updateTabName: (tabId, name) => {
        set((state) => ({
          openTabs: state.openTabs.map((tab) =>
            tab.id === tabId ? { ...tab, name } : tab
          ),
        }));
      },

      closeAllTabs: () => {
        // Always keep home tab
        set({
          openTabs: [
            {
              id: "home",
              name: "Home",
              type: "home",
              isDirty: false,
            },
          ],
          activeTabId: "home",
        });
      },

      closeOtherTabs: (tabId) => {
        set((state) => ({
          openTabs: state.openTabs.filter((tab) => tab.id === tabId || tab.id === "home"),
          activeTabId: tabId,
        }));
      },
    }),
    {
      name: "tab-storage",
      // Only persist these fields
      partialize: (state) => ({
        openTabs: state.openTabs,
        activeTabId: state.activeTabId,
      }),
    }
  )
);
