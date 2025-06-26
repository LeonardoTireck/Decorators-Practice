import { Component } from "./base-component.js";
import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";
import { autobind } from "../decorators/autobind.js";

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get person() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(
    project: Project,
    public hostElementId: string,
  ) {
    super("single-project", hostElementId, false, project.id);
    this.project = project;
    this.renderContent();
    this.configure();
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @autobind
  dragEndHandler(_event: DragEvent): void {}

  renderContent(): void {
    this.element.draggable = true;
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.person + " assigned.";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);

    this.element.addEventListener("dragend", this.dragEndHandler);
  }
}
