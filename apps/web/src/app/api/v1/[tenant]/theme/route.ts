import { NextResponse } from "next/server";
import { generateTailwindTheme } from "@enigma/theme";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant } = await params;

  // Mock fetching from Supabase based on tenant
  const tenantTheme = {
    colors: {
      primary: tenant === "spotify" ? "#1DB954" : "#0A66C2", // Spotify Green vs LinkedIn Blue
      surface: "#121212",
    },
  };

  const css = generateTailwindTheme(tenantTheme);
  return new NextResponse(css, {
    headers: { "Content-Type": "text/css" },
  });
}
