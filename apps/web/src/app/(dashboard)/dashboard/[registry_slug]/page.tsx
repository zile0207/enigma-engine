"use client";
import React, { useState, useEffect, useRef } from "react";

export default function DashboardPage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<DOMRect | null>(null);
  const [selectedElementRef, setSelectedElementRef] =
    useState<HTMLElement | null>(null);

  // Interaction State
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

  // 1. Precise Coordinate Sync
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
        // Width/Height logic
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

        // Apply Constraints
        newWidth = Math.max(32, newWidth);
        newHeight = Math.max(32, newHeight);
      } else if (interaction.type === "moving") {
        newLeft += deltaX;
        newTop += deltaY;
      }

      // 2. Direct DOM Update for 60fps
      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;

      // 3. Update Selection Box (Viewport Space)
      setSelectedElement(
        new DOMRect(
          newLeft + canvasRect.left,
          newTop + canvasRect.top,
          newWidth,
          newHeight
        )
      );
    };

    const handleMouseUp = () => {
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
      setSelectedElementRef(target as HTMLElement);

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
        className={`handle-trigger absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm z-[60] pointer-events-auto
          ${h.includes("top") ? "-top-1.5" : h.includes("bottom") ? "-bottom-1.5" : "top-1/2 -translate-y-1/2"}
          ${h.includes("left") ? "-left-1.5" : h.includes("right") ? "-right-1.5" : "left-1/2 -translate-x-1/2"}
          cursor-crosshair`}
      />
    ));
  };

  return (
    <div
      className={`h-screen w-full flex flex-col ${isEditMode ? "bg-zinc-900" : "bg-white"}`}
    >
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-6 bg-white z-10">
        <h1 className="font-bold">
          Enigma Engine / {selectedId || "Select Layer"}
        </h1>
        <button
          onClick={() => {
            setIsEditMode(!isEditMode);
            setSelectedId(null);
          }}
          className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
        >
          {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-zinc-50 p-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase mb-4">
            Layers
          </h2>
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
            className={`p-2 rounded cursor-pointer text-sm ${selectedId === "button-001" ? "bg-blue-100 text-blue-600" : ""}`}
          >
            Main Button
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          className="flex-1 relative bg-zinc-100 overflow-hidden"
        >
          {/* Component Instance */}
          <button
            data-enigma-id="button-001"
            style={{ position: "absolute", top: "200px", left: "300px" }}
            className="px-6 py-2 bg-black text-white rounded-md whitespace-nowrap"
          >
            Click Me
          </button>

          {/* Selection & Handle Overlay */}
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
              className="border-2 border-blue-500 z-50 ring-2 ring-blue-500/10 rounded-sm"
            >
              {renderHandles()}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-white p-4">
          <label className="text-[10px] font-bold text-zinc-400 uppercase">
            CSS Properties
          </label>
          <div className="mt-2 p-3 bg-zinc-50 rounded border text-xs font-mono">
            {selectedElement
              ? `w: ${Math.round(selectedElement.width)}px h: ${Math.round(selectedElement.height)}px`
              : "No selection"}
          </div>
        </div>
      </div>
    </div>
  );
}
