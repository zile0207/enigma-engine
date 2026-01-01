import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { applyLayoutPatch } from "@/lib/ast-surgeon";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const { project } = await params;
  const body = await req.json();
  const { selectedId, patch } = body as {
    selectedId: string;
    patch: { width: string; height: string; top: string; left: string };
  };

  try {
    // Path to the project page file
    // Note: This assumes projects are rendered in the same file structure
    // You may need to adjust this based on your actual file organization
    const projectPath = path.join(
      process.cwd(),
      "src/app/[username]/dashboard/[project]/page.tsx"
    );

    // Check if file exists
    try {
      await fs.access(projectPath);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Project page not found",
          path: projectPath,
        },
        { status: 404 }
      );
    }

    // Read current source code
    const sourceCode = await fs.readFile(projectPath, "utf-8");

    // Apply the layout patch using AST surgery
    const updatedCode = await applyLayoutPatch(sourceCode, selectedId, patch);

    // Write the updated code back to disk
    await fs.writeFile(projectPath, updatedCode, "utf-8");

    console.log(`[API] Successfully updated element ${selectedId} in project ${project}`);

    return NextResponse.json({
      success: true,
      elementId: selectedId,
      patch,
    });
  } catch (error) {
    console.error("[API] Failed to update element:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update element",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
