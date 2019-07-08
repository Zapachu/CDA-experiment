import { registerOnFramework } from "@bespoke/register";
import { Play } from "./Play";
import { Play4Owner } from "./Play4Owner";
import { Result4Owner } from "./Result4Owner";

registerOnFramework("DecisionSurvey", {
  localeNames: ["DecisionSurvey", "DecisionSurvey"],
  Play,
  Play4Owner,
  Result4Owner
});
