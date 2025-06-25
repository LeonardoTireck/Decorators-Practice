// ECMASCIRPT DECORATOR EXAMPLE
// function autobind(
//   _target: (...args: any[]) => any,
//   context: ClassMethodDecoratorContext,
// ) {
//   context.addInitializer(function (this: any) {
//     if (context.private)
//       throw new TypeError("Not supported on private methods.");
//     this[context.name] = this[context.name].bind(this);
//   });
// }

// TS Experimental Decorators Example
function autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor,
) {
  const originalDescriptor = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalDescriptor.bind(this);
    },
  };
  return adjustedDescriptor;
}
// Valid decorator for validating the input, using TS Experimental Decorators
// commented because i want to try a different approach
//
// function trimValidator(
//   _target: any,
//   _methodName: any,
//   descriptor: PropertyDescriptor,
// ) {
//   const originalMethod = descriptor.value;
//
//   descriptor.value = function (...args: any[]) {
//     const result = originalMethod.apply(this, args);
//     if (
//       !Array.isArray(result) ||
//       typeof result[0] !== "string" ||
//       typeof result[1] !== "string" ||
//       typeof result[2] !== "number"
//     ) {
//       console.warn("Unexpected return format from decorated method.");
//       return;
//     }
//     const [title, description, people] = result;
//
//     if (
//       title.trim().length === 0 ||
//       description.trim().length === 0 ||
//       String(people).trim().length === 0
//     ) {
//       alert("Invalid input.");
//       return;
//     }
//
//     return result;
//   };
//
//   return descriptor;
// }
//
// Creating an interface for draggable components
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

// Creating an interface for the target of the drag "Droppable"
interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  let isValid = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length > 0;
  }
  if (input.minLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length <= input.maxLength;
  }
  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max != null && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }
  return isValid;
}

// Creating a Base Class for components. Using generics to keep the types of HTML Elemets
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string,
  ) {
    this.templateElement = document.getElementById(
      templateId,
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    this.element = document.importNode(this.templateElement.content, true)
      .firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element,
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

interface Observer {
  update(projects: Project[]): void;
}

// Creating a base class for managing state.
abstract class State {
  protected observers: Observer[] = [];

  public attach(observer: Observer) {
    // check if observer is already attached
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log("Observer already attached.");
    } else {
      console.log(`Attached an observer`);
      this.observers.push(observer);
    }
  }

  public detach(observer: Observer) {
    const obsIndex = this.observers.indexOf(observer);
    if (obsIndex === -1) {
      return console.log("Non-existent observer");
    } else {
      console.log(`Observer removed: ${observer}`);
      this.observers.splice(obsIndex, 1);
    }
  }
}

class ProjectState extends State {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {
    super();
  }

  public notify() {
    console.log("Notifying observers...");
    const projectsCopy = this.projects.slice();
    console.log(projectsCopy);
    for (const observer of this.observers) {
      observer.update(projectsCopy);
    }
  }

  public addProject(title: string, description: string, numOfPeople: number) {
    let newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      "active",
    );
    this.projects.push(newProject);
    this.notify();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
}

const projectState = ProjectState.getInstance();

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: "active" | "finished",
  ) {}
}

class ProjectItem
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
  dragStartHandler(_event: DragEvent): void {
    console.log("Drag event started");
  }

  @autobind
  dragEndHandler(_event: DragEvent): void {
    console.log("Drag event ended");
  }

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

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements Observer, DragTarget
{
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.configure();
    this.renderContent();
  }

  @autobind
  dropHandler(_event: DragEvent): void {
    console.log("Drop event handler");
  }

  @autobind
  dragOverHandler(_event: DragEvent): void {
    console.log("Drag over event handler");
  }

  @autobind
  dragLeaveHandler(_event: DragEvent): void {
    console.log("Drag leave event handler");
  }

  update(projectsCopy: Project[]) {
    const hostProjectList = document.getElementById(
      `${this.type}-projects-list`,
    )! as HTMLUListElement;
    hostProjectList.innerHTML = "";
    projectsCopy.forEach((p) => {
      new ProjectItem(p, this.element.querySelector("ul")!.id);
    });
  }

  configure() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`; // For CSS
    if (this.type === "finished") {
      this.element.addEventListener("drop", this.dropHandler);
      this.element.addEventListener("dragenter", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
    }
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  public titleEl: HTMLInputElement;
  public descriptionEl: HTMLInputElement;
  public peopleEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleEl = this.element.querySelector("#title")! as HTMLInputElement;
    this.descriptionEl = this.element.querySelector(
      "#description",
    )! as HTMLInputElement;
    this.peopleEl = this.element.querySelector("#people")! as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  // @trimValidator
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleEl.value;
    const enteredDescription = this.descriptionEl.value;
    const enteredPeople = this.peopleEl.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 4,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 10,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input.");
      return;
    }
    return [enteredTitle, enteredDescription, +enteredPeople];
  }
  //

  private clearInputs() {
    this.titleEl.value = "";
    this.descriptionEl.value = "";
    this.peopleEl.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const activeProjectsList = new ProjectList("active");
const fineshedProjectsList = new ProjectList("finished");
projectState.attach(activeProjectsList);
