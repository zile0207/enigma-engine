import { NextResponse } from "next/server";
import { registryItemSchema } from "@enigma/registry-schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenant: string; component: string }> }
) {
  const { tenant, component } = await params;

  // 1. In a real app, you would fetch this from Supabase based on the tenant/component
  // For now, we return a mock object that matches your Registry Schema
  const mockData = {
    name: component,
    type: "registry:ui",
    files: [
      {
        path: `ui/${component}.tsx`,
        type: "registry:component",
        content: `export const My${component.charAt(0).toUpperCase() + component.slice(1)} = () => <button>Hello ${tenant}</button>`,
      },
    ],
    dependencies: ["lucide-react"],
  };

  // 2. Validate the data against your shared schema package
  const validation = registryItemSchema.safeParse(mockData);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid Registry Item" },
      { status: 500 }
    );
  }

  // 3. Return the JSON to the CLI
  return NextResponse.json(validation.data);
}
