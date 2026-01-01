"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

type Position = { x: number; y: number };
type Size = { width: number; height: number };
type InteractionState = "idle" | "dragging" | "resizing" | "panning";

interface ElementData {
  id: string;
  type: "button" | "text";
  position: Position;
  size: Size;
  zIndex: number;
}

interface DragState {
  elementId: string;
  startPosition: Position;
  startMouse: Position;
}

interface ResizeState {
  elementId: string;
  handle: string;
  startPosition: Position;
  startSize: Size;
  startMouse: Position;
}

export default function ProjectDashboardPage({
  params,
}: {
  params: Promise<{
    username: string;
    project: string;
  }>;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [projectName, setProjectName] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [elements, setElements] = useState<Record<string, ElementData>>({});
  const [interactionState, setInteractionState] =
    useState<InteractionState>("idle");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Load project and saved elements
  useEffect(() => {
    params.then(({ project }) => {
      setProjectName(project);
      loadElements(project);
    });
  }, [params]);

  const loadElements = (project: string) => {
    try {
      const saved = localStorage.getItem(`enigma-${project}-elements`);
      if (saved) {
        setElements(JSON.parse(saved));
      } else {
        // Default elements for demo
        const defaultElements: Record<string, ElementData> = {
          "button-001": {
            id: "button-001",
            type: "button",
            position: { x: 100, y: 100 },
            size: { width: 200, height: 50 },
            zIndex: 1,
          },
        };
        setElements(defaultElements);
        saveElements(project, defaultElements);
      }
    } catch (error) {
      console.error("Failed to load elements:", error);
    }
  };

  const saveElements = (project: string, els: Record<string, ElementData>) => {
    try {
      localStorage.setItem(`enigma-${project}-elements`, JSON.stringify(els));
    } catch (error) {
      console.error("Failed to save elements:", error);
    }
  };

  // Mouse handlers for drag/resize
  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent,
      elementId: string,
      action?: string,
      handle?: string
    ) => {
      if (!isEditMode) return;
      e.stopPropagation();

      if (action === "resize" && handle) {
        const element = elements[elementId];
        setResizeState({
          elementId,
          handle,
          startPosition: { ...element.position },
          startSize: { ...element.size },
          startMouse: { x: e.clientX, y: e.clientY },
        });
        setInteractionState("resizing");
      } else {
        // Start dragging element
        const element = elements[elementId];
        setDragState({
          elementId,
          startPosition: { ...element.position },
          startMouse: { x: e.clientX, y: e.clientY },
        });
        setInteractionState("dragging");
      }
    },
    [isEditMode, elements]
  );

  // Selection system
  const handleElementClick = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      // In edit mode, clicking selects element and starts dragging
      if (isEditMode) {
        e.stopPropagation();
        setSelectedId(elementId);
        handleMouseDown(e, elementId);
      }
    },
    [isEditMode, handleMouseDown]
  );

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  }, []);

  // Get element position in canvas coordinates
  const getElementPosition = (element: ElementData): Position => {
    return element.position;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (interactionState === "dragging" && dragState) {
        const deltaX = (e.clientX - dragState.startMouse.x) / scale;
        const deltaY = (e.clientY - dragState.startMouse.y) / scale;

        setElements((prev) => {
          const updated = { ...prev };
          const element = { ...updated[dragState.elementId] };
          element.position = {
            x: dragState.startPosition.x + deltaX,
            y: dragState.startPosition.y + deltaY,
          };
          updated[dragState.elementId] = element;
          saveElements(projectName, updated);
          return updated;
        });
      } else if (interactionState === "resizing" && resizeState) {
        const deltaX = (e.clientX - resizeState.startMouse.x) / scale;
        const deltaY = (e.clientY - resizeState.startMouse.y) / scale;

        setElements((prev) => {
          const updated = { ...prev };
          const element = { ...updated[resizeState.elementId] };
          const handle = resizeState.handle;

          let newWidth = resizeState.startSize.width;
          let newHeight = resizeState.startSize.height;
          let newX = resizeState.startPosition.x;
          let newY = resizeState.startPosition.y;

          if (handle.includes("right"))
            newWidth = Math.max(32, resizeState.startSize.width + deltaX);
          if (handle.includes("left")) {
            newWidth = Math.max(32, resizeState.startSize.width - deltaX);
            newX = resizeState.startPosition.x + deltaX;
          }
          if (handle.includes("bottom"))
            newHeight = Math.max(32, resizeState.startSize.height + deltaY);
          if (handle.includes("top")) {
            newHeight = Math.max(32, resizeState.startSize.height - deltaY);
            newY = resizeState.startPosition.y + deltaY;
          }

          element.size = { width: newWidth, height: newHeight };
          element.position = { x: newX, y: newY };
          updated[resizeState.elementId] = element;
          saveElements(projectName, updated);
          return updated;
        });
      }
    };

    const handleMouseUp = () => {
      if (interactionState !== "idle") {
        // Trigger AST surgery update
        if (dragState || resizeState) {
          const elementId = dragState?.elementId || resizeState?.elementId;
          if (elementId) {
            updateElementInSourceCode(elementId);
          }
        }
      }
      setInteractionState("idle");
      setDragState(null);
      setResizeState(null);
    };

    if (interactionState !== "idle") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [interactionState, dragState, resizeState, scale, projectName]);

  // API Integration - AST Surgery
  const updateElementInSourceCode = async (elementId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${projectName}/update-element`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            elementId,
            element: elements[elementId],
          }),
        }
      );
      if (!response.ok) {
        console.error("Failed to update element in source code");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  // Render selection box and handles
  const renderSelectionUI = () => {
    if (!selectedId || !elements[selectedId]) return null;
    const element = elements[selectedId];
    const pos = getElementPosition(element);

    const handles = [
      // Corner handles (visible, solid white with blue border)
      { pos: "top-left", cursor: "nw-resize", x: -8, y: -8, size: 16 },
      { pos: "top-right", cursor: "ne-resize", x: -8, y: -8, size: 16 },
      { pos: "bottom-left", cursor: "sw-resize", x: -8, y: -8, size: 16 },
      { pos: "bottom-right", cursor: "se-resize", x: -8, y: -8, size: 16 },
      // Edge handles (larger hit area, visible dots)
      { pos: "top", cursor: "n-resize", x: 0, y: -8, size: 16, edge: true },
      { pos: "bottom", cursor: "s-resize", x: 0, y: -8, size: 16, edge: true },
      { pos: "left", cursor: "w-resize", x: -8, y: 0, size: 16, edge: true },
      { pos: "right", cursor: "e-resize", x: -8, y: 0, size: 16, edge: true },
    ];

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${pos.x + canvasOffset.x}px`,
          top: `${pos.y + canvasOffset.y}px`,
          width: `${element.size.width}px`,
          height: `${element.size.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          zIndex: 50,
        }}
      >
        {/* Selection border */}
        <div className="absolute inset-0 border border-blue-500 rounded-sm" />

        {/* Resize handles */}
        {handles.map((handle) => (
          <div
            key={handle.pos}
            className={`absolute pointer-events-auto bg-white border border-blue-500 ${handle.edge ? "hover:scale-125" : "hover:bg-blue-50"}`}
            style={{
              width: `${handle.edge ? handle.size : 8}px`,
              height: `${handle.edge ? handle.size : 8}px`,
              cursor: handle.cursor,
              left: handle.pos.includes("left")
                ? `${handle.x}px`
                : handle.pos.includes("right")
                  ? `calc(100% + ${handle.x}px)`
                  : `calc(50% - ${handle.size / 2}px)`,
              top: handle.pos.includes("top")
                ? `${handle.y}px`
                : handle.pos.includes("bottom")
                  ? `calc(100% + ${handle.y}px)`
                  : `calc(50% - ${handle.size / 2}px)`,
              transition: "transform 0.1s ease, background-color 0.1s ease",
            }}
            onMouseDown={(e) =>
              handleMouseDown(e, selectedId!, "resize", handle.pos)
            }
          />
        ))}
      </div>
    );
  };

  const selectedElement = selectedId ? elements[selectedId] : null;

  return (
    <div
      className={`h-screen w-full flex flex-col ${isEditMode ? "bg-slate-900" : "bg-slate-50"}`}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Layers Panel */}
        <div className="w-72 border-r border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Layers
            </h2>
          </div>
          <div className="flex-1 p-3 space-y-1 overflow-y-auto">
            {Object.values(elements).map((element) => {
              const isSelected = selectedId === element.id;
              return (
                <div
                  key={element.id}
                  onClick={() => setSelectedId(element.id)}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50 border border-transparent"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${isSelected ? "bg-blue-500" : "bg-slate-300 group-hover:bg-slate-400"}`}
                  />
                  <span
                    className={`text-sm ${isSelected ? "text-blue-700 font-medium" : "text-slate-600"}`}
                  >
                    {element.type === "button" ? "Button" : "Text"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Canvas */}
        <div
          id="canvas"
          ref={canvasRef}
          onMouseDown={handleCanvasClick}
          className={`flex-1 relative overflow-hidden ${isEditMode ? "bg-slate-100 cursor-crosshair" : "bg-slate-50"}`}
          style={{
            backgroundImage: isEditMode
              ? "radial-gradient(#cbd5e1 1px, transparent 1px)"
              : "none",
            backgroundSize: isEditMode ? "16px 16px" : "auto",
          }}
        >
          {/* Render all elements */}
          {Object.values(elements).map((element) => {
            const pos = getElementPosition(element);

            return (
              <div
                key={element.id}
                data-element-id={element.id}
                onMouseDown={(e) => handleElementClick(e, element.id)}
                className={`absolute transition-all ${selectedId === element.id && isEditMode ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
                style={{
                  left: `${pos.x + canvasOffset.x}px`,
                  top: `${pos.y + canvasOffset.y}px`,
                  width: `${element.size.width}px`,
                  height: `${element.size.height}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  zIndex: element.zIndex,
                  cursor: isEditMode ? "move" : "default",
                }}
              >
                {/* Button element */}
                {element.type === "button" && (
                  <button className="w-full h-full px-6 py-2 bg-slate-900 text-white rounded-lg shadow-lg shadow-slate-900/20">
                    Click Me
                  </button>
                )}
              </div>
            );
          })}

          {/* Selection UI */}
          {renderSelectionUI()}
        </div>

        <div className="w-80 border-l border-slate-200 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-slate-700 tracking-wide">
                Enigma Engine
              </h1>
              <span className="text-xs text-slate-400">
                / {projectName || "Project"}
              </span>
            </div>
            <button
              onClick={() => {
                setIsEditMode(!isEditMode);
                setSelectedId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isEditMode ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"}`}
            >
              {isEditMode ? "Exit" : "Edit"}
            </button>
          </div>
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Properties
            </h2>
          </div>
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {selectedElement ? (
              <>
                {/* Position Section */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
                    Position
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-xs text-slate-500">X</span>
                      <span className="text-sm font-mono text-slate-700 font-medium">
                        {Math.round(selectedElement.position.x)}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-xs text-slate-500">Y</span>
                      <span className="text-sm font-mono text-slate-700 font-medium">
                        {Math.round(selectedElement.position.y)}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-xs text-slate-500">Z Index</span>
                      <span className="text-sm font-mono text-slate-700 font-medium">
                        {selectedElement.zIndex}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Size Section */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
                    Size
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-xs text-slate-500">Width</span>
                      <span className="text-sm font-mono text-slate-700 font-medium">
                        {Math.round(selectedElement.size.width)}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-xs text-slate-500">Height</span>
                      <span className="text-sm font-mono text-slate-700 font-medium">
                        {Math.round(selectedElement.size.height)}px
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
                    Info
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-xs text-slate-500">ID</span>
                      <span className="text-sm font-mono text-slate-700 font-medium">
                        {selectedElement.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-xs text-slate-500">Type</span>
                      <span className="text-sm font-mono text-slate-700 font-medium capitalize">
                        {selectedElement.type}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Select an element to view properties
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
