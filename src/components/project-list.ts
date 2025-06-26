import { Component } from "./base-component.js";
import { DragTarget } from "../models/drag-drop.js";
import { Observer } from "../state/base-state.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { Project } from "../models/project.js";
import { ProjectItem } from "./project-item.js";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements Observer, DragTarget
{
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.configure();
    this.renderContent();
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer?.getData("text/plain");
    const project = projectState.allProjects.find((p) => p.id === projectId);
    if (!project || project.status === this.type) {
      return console.log("Project not found or project did not change status.");
    }
    project.status = this.type;
    projectState.notify();
    let ulElement = this.element.querySelector("ul")!;
    ulElement.classList.remove("droppable");
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      let ulElement = this.element.querySelector("ul")!;
      ulElement.classList.add("droppable");
    }
  }

  @autobind
  dragLeaveHandler(_event: DragEvent): void {
    let ulElement = this.element.querySelector("ul")!;
    ulElement.classList.remove("droppable");
  }

  @autobind
  update(projectsCopy: Project[]) {
    const hostProjectList = document.getElementById(
      `${this.type}-projects-list`,
    )! as HTMLUListElement;
    hostProjectList.innerHTML = "";
    projectsCopy.forEach((p) => {
      if (p.status === this.type) {
        new ProjectItem(p, this.element.querySelector("ul")!.id);
      }
    });
  }

  configure() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`; // For CSS
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}
