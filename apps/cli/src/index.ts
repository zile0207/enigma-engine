import { Command } from "commander";
import axios from "axios";
import fs from "fs-extra";
import path from "path";

const program = new Command();

program
  .name("enigma-engine")
  .description("The core engine for branded design system CLIs")
  .version("1.0.0");

program
  .command("add <component>")
  .option("-r, --registry <name>", "The tenant registry to pull from")
  .action(async (component, options) => {
    const registry = options.registry || "default";
    const endpoint = `http://localhost:3000/api/v1/${registry}/${component}`;

    try {
      console.log(`🚀 Fetching ${component} from ${registry}...`);
      const { data } = await axios.get(endpoint);

      // Eject the code into the local project
      for (const file of data.files) {
        const localPath = path.join(
          process.cwd(),
          "src/components/enigma",
          file.path
        );
        await fs.ensureDir(path.dirname(localPath));
        await fs.writeFile(localPath, file.content);
      }

      console.log(
        `✅ Successfully installed ${component} into src/components/enigma/`
      );
    } catch (error) {
      console.error(
        "❌ Failed to install component:",
        error instanceof Error ? error.message : String(error)
      );
    }
  });

program.parse();
