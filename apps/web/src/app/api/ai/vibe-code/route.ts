import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { applyLayoutPatch } from "@/lib/ast-surgeon";

export async function POST(req: Request) {
  const { selectedId, patch } = await req.json();

  try {
    // 1. Path to your current page file
    const filePath = path.join(
      process.cwd(),
      "src/app/(dashboard)/dashboard/[registry_slug]/page.tsx"
    );

    // 2. Read current source
    const sourceCode = await fs.readFile(filePath, "utf-8");

    // 3. Apply the surgery
    const updatedCode = await applyLayoutPatch(sourceCode, selectedId, patch);

    // 4. Save back to disk
    await fs.writeFile(filePath, updatedCode);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Surgery failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update file" },
      { status: 500 }
    );
  }
}
