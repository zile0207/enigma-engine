"use client";
import React, { useState, useEffect, useRef } from "react";

export default function DashboardPage() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<DOMRect | null>(null);
  const [selectedElementRef, setSelectedElementRef] =
    useState<HTMLElement | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Resize handle state
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);

  // Draggable state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  const renderHandles = () => {
    if (!selectedElement || !isEditMode) return null;

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

    return handles.map((handle) => (
      <div
        key={handle}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          setDragHandle(handle);
        }}
        className={`handle-trigger absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm z-[60] ${
          handle.includes("top")
            ? "-top-1.5"
            : handle.includes("bottom")
              ? "-bottom-1.5"
              : ""
        } ${
          handle.includes("left")
            ? "-left-1.5"
            : handle.includes("right")
              ? "-right-1.5"
              : ""
        } ${
          handle === "top" || handle === "bottom"
            ? "left-1/2 -translate-x-1/2 cursor-ns-resize"
            : ""
        } ${
          handle === "left" || handle === "right"
            ? "top-1/2 -translate-y-1/2 cursor-ew-resize"
            : ""
        } ${
          handle.includes("top-left") || handle.includes("bottom-right")
            ? "cursor-nwse-resize"
            : ""
        } ${
          handle.includes("top-right") || handle.includes("bottom-left")
            ? "cursor-nesw-resize"
            : ""
        }`}
      />
    ));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!selectedId || !selectedElement || !canvasRef.current) return;

      const element = document.querySelector(
        `[data-enigma-id="${selectedId}"]`
      ) as HTMLElement;
      if (!element) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();

      // 1. Convert Mouse Viewport -> Canvas Local coordinates
      const localMouseX = e.clientX - canvasRect.left;
      const localMouseY = e.clientY - canvasRect.top;

      // 2. Convert current Element Viewport -> Canvas Local coordinates
      const localElemLeft = selectedElement.left - canvasRect.left;
      const localElemTop = selectedElement.top - canvasRect.top;

      // Case A: Handling Resize [Already built]
      if (isDragging) {
        let newWidth = selectedElement.width;
        let newHeight = selectedElement.height;
        let newTop = selectedElement.top;
        let newLeft = selectedElement.left;

        if (dragHandle?.includes("right"))
          newWidth = localMouseX - localElemLeft;
        if (dragHandle?.includes("bottom"))
          newHeight = localMouseY - localElemTop;

        // Handle Left/Top (Changes size AND position)
        if (dragHandle?.includes("left")) {
          newWidth = localElemLeft + selectedElement.width - localMouseX;
          newLeft = localMouseX;
        }
        if (dragHandle?.includes("top")) {
          newHeight = localElemTop + selectedElement.height - localMouseY;
          newTop = localMouseY;
        }

        // Apply to the Button directly for the 60fps "vibe"
        element.style.width = `${newWidth}px`;
        element.style.height = `${newHeight}px`;
        element.style.top = `${newTop}px`;
        element.style.left = `${newLeft}px`;

        // Update Blue Box (Always uses viewport coordinates for 'fixed' position)
        setSelectedElement(
          new DOMRect(
            newLeft + canvasRect.left,
            newTop + canvasRect.top,
            newWidth,
            newHeight
          )
        );
      }

      // Case B: Handling Movement (New!)
      if (isMoving && selectedId && selectedElement) {
        const element = document.querySelector(
          `[data-enigma-id="${selectedId}"]`
        ) as HTMLElement;
        if (!element) return;

        // Calculate new position based on current mouse and initial offset
        const newLeft = e.clientX - canvasRect.left - dragOffset.x;
        const newTop = e.clientY - canvasRect.top - dragOffset.y;

        // Apply to DOM directly for 60fps movement
        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;

        // Sync the Blue Box overlay
        setSelectedElement(
          new DOMRect(
            newLeft + canvasRect.left,
            newTop + canvasRect.top,
            selectedElement.width,
            selectedElement.height
          )
        );
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsMoving(false);
      setDragHandle(null);
      document.body.classList.remove("is-dragging");
    };

    if (isDragging || isMoving) {
      document.body.classList.add("is-dragging");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.body.classList.remove("is-dragging");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isMoving,
    dragHandle,
    selectedId,
    selectedElement,
    dragOffset,
  ]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;

    const target = (e.target as HTMLElement).closest("[data-enigma-id]");

    if (target) {
      const id = target.getAttribute("data-enigma-id");
      setSelectedId(id);
      setSelectedElement(target.getBoundingClientRect());
      setSelectedElementRef(target as HTMLElement);
    } else {
      setSelectedId(null);
      setSelectedElement(null);
      setSelectedElementRef(null);
    }
  };

  const handleSidebarClick = (id: string) => {
    if (!isEditMode) return;
    setSelectedId(id);
    const element = document.querySelector(`[data-enigma-id="${id}"]`);
    if (element) {
      setSelectedElement(element.getBoundingClientRect());
      setSelectedElementRef(element as HTMLElement);
    }
  };

  const getSelectedClasses = () => {
    if (!selectedElementRef) return "";
    return selectedElementRef.className;
  };

  const handleVibeCode = async () => {
    if (!prompt || !selectedId) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/vibe-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          selectedId,
          componentId: "button",
          registry: "spotify",
        }),
      });

      const data = await response.json();
      console.log("AI suggested changes:", data);
    } catch (error) {
      console.error("Vibe coding failed:", error);
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };

  return (
    <div
      className={`h-screen w-full flex flex-col ${isEditMode ? "bg-zinc-900" : "bg-white"}`}
    >
      {/* Top Bar */}
      <div className="h-14 border-b flex items-center justify-between px-6 bg-white">
        <h1 className="font-bold text-lg">Enigma Engine / Spotify</h1>
        <button
          onClick={() => {
            setIsEditMode(!isEditMode);
            setSelectedId(null);
            setSelectedElement(null);
            setSelectedElementRef(null);
            setPrompt("");
          }}
          className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
        >
          {isEditMode ? "View Documentation" : "Enter Edit Mode"}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-zinc-50 p-4">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Layers
          </h2>
          <ul className="space-y-1">
            <li
              onClick={() => handleSidebarClick("button-001")}
              className={`text-sm font-medium p-2 rounded cursor-pointer ${
                selectedId === "button-001"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              Main Button
            </li>
            <li
              onClick={() => handleSidebarClick("text-001")}
              className={`text-sm font-medium p-2 rounded cursor-pointer ${
                selectedId === "text-001"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              Text Label
            </li>
          </ul>
        </div>

        {/* The Canvas (The "Framer" Area) */}
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="flex-1 relative bg-zinc-100 overflow-auto p-20"
        >
          {/* The Bounding Box Overlay with Resize Handles */}
          {isEditMode && selectedElement && (
            <div
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest(".handle-trigger"))
                  return;

                setIsMoving(true);

                // Offset is distance from mouse click to blue box's top-left corner
                setDragOffset({
                  x: e.clientX - selectedElement.left,
                  y: e.clientY - selectedElement.top,
                });
              }}
              style={{
                position: "fixed",
                top: selectedElement.top,
                left: selectedElement.left,
                width: selectedElement.width,
                height: selectedElement.height,
                cursor: isMoving ? "grabbing" : "grab",
                pointerEvents: "all",
              }}
              className={`border-2 border-blue-500 z-50 ring-2 ring-blue-500/20 rounded-sm ${
                isDragging || isMoving
                  ? "transition-none"
                  : "transition-all duration-150"
              }`}
            >
              {/* The invisible hit area for handles */}
              <div className="absolute inset-0 pointer-events-auto handle-trigger">
                {renderHandles()}
              </div>
            </div>
          )}

          {/* This is where the interactive component will live */}
          <button
            data-enigma-id="button-001"
            style={{
              position: "absolute",
            }}
            className="px-6 py-2 bg-[var(--color-primary,black)] text-white rounded-md"
          >
            <span data-enigma-id="text-001" className="inline-block">
              Click Me
            </span>
          </button>
        </div>

        {/* NEW: Right Sidebar (Inspector Panel) */}
        <div className="w-80 border-l bg-white flex flex-col">
          {selectedId ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b">
                <h3 className="text-sm font-bold truncate">{selectedId}</h3>
                <p className="text-xs text-zinc-500">Component Properties</p>
              </div>

              {/* Property Inspector */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">
                      Current Classes
                    </label>
                    <div className="mt-1 p-2 bg-zinc-50 border rounded text-[11px] font-mono break-all">
                      {getSelectedClasses() || "No classes"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">
                      Applied Tokens
                    </label>
                    <div className="mt-1 flex gap-1">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px]">
                        primary
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Prompt Area (The "Vibe Coding" Input) */}
              <div className="p-4 border-t bg-zinc-50">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        handleVibeCode();
                      }
                    }}
                    placeholder={`Vibe code the ${selectedId}...`}
                    disabled={isGenerating}
                    className="w-full p-3 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[80px] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleVibeCode}
                    disabled={isGenerating || !prompt.trim()}
                    className={`absolute bottom-3 right-3 p-1.5 rounded-md transition-colors ${
                      isGenerating || !prompt.trim()
                        ? "bg-zinc-300 cursor-not-allowed"
                        : "bg-black text-white hover:bg-zinc-800"
                    }`}
                  >
                    {isGenerating ? (
                      <div className="animate-spin">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                      </div>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
              Select a layer to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
