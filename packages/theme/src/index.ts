import { z } from "zod";

export const themeSchema = z.object({
  colors: z.record(z.string()), // e.g., { "primary": "#1DB954" }
  spacing: z.record(z.string()).optional(),
  borderRadius: z.record(z.string()).optional(),
});

export type Theme = z.infer<typeof themeSchema>;

// Helper to convert JSON to Tailwind v4 @theme CSS
export function generateTailwindTheme(theme: Theme) {
  let css = "@theme {\n";
  for (const [key, value] of Object.entries(theme.colors)) {
    css += `  --color-${key}: ${value};\n`;
  }
  css += "}";
  return css;
}
