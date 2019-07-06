import { registerOnFramework } from "@bespoke/register";
import { Play } from "./Play";
import { Play4Owner } from "./Play4Owner";

registerOnFramework("DecisionSurvey", {
  localeNames: ["DecisionSurvey", "DecisionSurvey"],
  Play,
  Play4Owner
});
