import { registerOnFramework } from "@bespoke/register";
import { Play } from "./Play";
import { Play4Owner } from "./Play4Owner";
import { Result4Owner } from "./Result4Owner";

registerOnFramework("SceneSurvey", {
  localeNames: ["SceneSurvey", "SceneSurvey"],
  Play,
  Play4Owner,
  Result4Owner
});
