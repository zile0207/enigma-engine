"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ username: string; project: string }>;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<DOMRect | null>(null);
  const [projectName, setProjectName] = useState<string>("");

  const [interaction, setInteraction] = useState<{
    type: "moving" | "resizing" | null;
    handle: string | null;
    initialRect: DOMRect | null;
    initialMouse: { x: number; y: number };
  }>({
    type: null,
    handle: null,
    initialRect: null,
    initialMouse: { x: 0, y: 0 },
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then((p) => setProjectName(p.project));
  }, [params]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (
        !interaction.type ||
        !selectedId ||
        !selectedElement ||
        !canvasRef.current
      )
        return;

      const element = document.querySelector(
        `[data-enigma-id="${selectedId}"]`
      ) as HTMLElement;
      if (!element) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const deltaX = e.clientX - interaction.initialMouse.x;
      const deltaY = e.clientY - interaction.initialMouse.y;

      let newWidth = interaction.initialRect!.width;
      let newHeight = interaction.initialRect!.height;
      let newTop = interaction.initialRect!.top - canvasRect.top;
      let newLeft = interaction.initialRect!.left - canvasRect.left;

      if (interaction.type === "resizing") {
        const h = interaction.handle;
        if (h?.includes("right")) newWidth += deltaX;
        if (h?.includes("bottom")) newHeight += deltaY;
        if (h?.includes("left")) {
          newWidth -= deltaX;
          newLeft += deltaX;
        }
        if (h?.includes("top")) {
          newHeight -= deltaY;
          newTop += deltaY;
        }

        newWidth = Math.max(32, newWidth);
        newHeight = Math.max(32, newHeight);
      } else if (interaction.type === "moving") {
        newLeft += deltaX;
        newTop += deltaY;
      }

      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;

      setSelectedElement(
        new DOMRect(
          newLeft + canvasRect.left,
          newTop + canvasRect.top,
          newWidth,
          newHeight
        )
      );
    };

    const handleMouseUp = async () => {
      if (!interaction.type || !selectedId) return;

      const element = document.querySelector(
        `[data-enigma-id="${selectedId}"]`
      ) as HTMLElement;
      if (element) {
        const patch = {
          width: element.style.width,
          height: element.style.height,
          top: element.style.top,
          left: element.style.left,
        };

        await fetch("/api/ai/vibe-code", {
          method: "POST",
          body: JSON.stringify({ selectedId, patch }),
        });
      }

      setInteraction({
        type: null,
        handle: null,
        initialRect: null,
        initialMouse: { x: 0, y: 0 },
      });
      document.body.style.cursor = "default";
    };

    if (interaction.type) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [interaction, selectedId, selectedElement]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;

    if ((e.target as HTMLElement).classList.contains("handle-trigger")) return;

    const target = (e.target as HTMLElement).closest("[data-enigma-id]");
    if (target) {
      const id = target.getAttribute("data-enigma-id")!;
      const rect = target.getBoundingClientRect();

      setSelectedId(id);
      setSelectedElement(rect);

      setInteraction({
        type: "moving",
        handle: null,
        initialRect: rect,
        initialMouse: { x: e.clientX, y: e.clientY },
      });
    } else {
      setSelectedId(null);
      setSelectedElement(null);
    }
  };

  const renderHandles = () => {
    const handles = [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
      "top",
      "bottom",
      "left",
      "right",
    ];
    return handles.map((h) => (
      <div
        key={h}
        onMouseDown={(e) => {
          e.stopPropagation();
          setInteraction({
            type: "resizing",
            handle: h,
            initialRect: selectedElement,
            initialMouse: { x: e.clientX, y: e.clientY },
          });
        }}
        className={`handle-trigger absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-sm z-[60] pointer-events-auto
          ${h.includes("top") ? "-top-1.5" : h.includes("bottom") ? "-bottom-1.5" : "top-1/2 -translate-y-1/2"}
          ${h.includes("left") ? "-left-1.5" : h.includes("right") ? "-right-1.5" : "left-1/2 -translate-x-1/2"}
          hover:bg-blue-600 hover:scale-125 transition-all cursor-crosshair`}
      />
    ));
  };

  return (
    <div
      className={`h-screen w-full flex flex-col ${isEditMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold text-slate-700 tracking-wide">
            Enigma Engine
          </h1>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-medium text-slate-900">
            {projectName || selectedId ? selectedId : "Dashboard"}
          </span>
        </div>
        <button
          onClick={() => {
            setIsEditMode(!isEditMode);
            setSelectedId(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isEditMode
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
          }`}
        >
          {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 border-r border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Layers
            </h2>
          </div>
          <div className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div
              onClick={() => {
                const el = document.querySelector(
                  '[data-enigma-id="button-001"]'
                );
                if (el) {
                  setSelectedId("button-001");
                  setSelectedElement(el.getBoundingClientRect());
                }
              }}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                selectedId === "button-001"
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  selectedId === "button-001"
                    ? "bg-blue-500"
                    : "bg-slate-300 group-hover:bg-slate-400"
                }`}
              />
              <span
                className={`text-sm ${
                  selectedId === "button-001"
                    ? "text-blue-700 font-medium"
                    : "text-slate-600"
                }`}
              >
                Main Button
              </span>
            </div>
          </div>
        </div>

        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          className={`flex-1 relative overflow-hidden bg-slate-50 ${
            isEditMode
              ? "[background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"
              : ""
          }`}
        >
          <button
            data-enigma-id="button-001"
            style={{
              position: "absolute",
              top: "137px",
              left: "175px",
              width: "177.297px",
              height: "280px",
            }}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg whitespace-nowrap shadow-lg shadow-slate-900/20"
          >
            <span data-enigma-id="text-001">Click Me</span>
          </button>

          {isEditMode && selectedElement && (
            <div
              style={{
                position: "fixed",
                top: selectedElement.top,
                left: selectedElement.left,
                width: selectedElement.width,
                height: selectedElement.height,
                pointerEvents: "none",
              }}
              className="border-2 border-blue-500 z-50 shadow-lg shadow-blue-500/20"
            >
              {renderHandles()}
            </div>
          )}
        </div>

        <div className="w-80 border-l border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Properties
            </h2>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                CSS Properties
              </label>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500">Width</span>
                  <span className="text-sm font-mono text-slate-700 font-medium">
                    {selectedElement
                      ? `${Math.round(selectedElement.width)}px`
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500">Height</span>
                  <span className="text-sm font-mono text-slate-700 font-medium">
                    {selectedElement
                      ? `${Math.round(selectedElement.height)}px`
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
