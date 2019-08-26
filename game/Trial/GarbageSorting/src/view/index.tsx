import { registerOnFramework } from "@bespoke/client";
import { Create } from "./Create";
import { Play } from "./Play";

registerOnFramework("GarbageSorting", {
  localeNames: ["垃圾分类", "Garbage Sorting"],
  Create,
  Play
});
