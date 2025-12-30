import { z } from "zod";

export const registryItemSchema = z.object({
  name: z.string(),
  type: z.enum(["registry:ui", "registry:component"]),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      type: z.string(),
    })
  ),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;
