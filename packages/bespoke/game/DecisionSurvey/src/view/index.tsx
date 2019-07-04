import { registerOnFramework } from "elf-component";
import { Create } from "./Create";
import { Play } from "./Play";
import { Play4Owner } from "./Play4Owner";

registerOnFramework("ParallelApplication", {
  localeNames: ["平行志愿", "Parallel Application"],
  Create,
  Play,
  Play4Owner
});
