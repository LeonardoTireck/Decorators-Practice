import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";
import { projectState } from "./state/project-state.js";

new ProjectInput();
const activeProjectsList = new ProjectList("active");
const fineshedProjectsList = new ProjectList("finished");
projectState.attach(activeProjectsList);
projectState.attach(fineshedProjectsList);
