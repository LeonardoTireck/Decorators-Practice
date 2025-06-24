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
  update(project: any): void;
}

class ProjectState {
  private projects: any[] = [];
  private static instance: ProjectState;
  private observers: Observer[] = [];
  private constructor() {}

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

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements Observer
{
  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.renderContent();
  }

  update(projectsCopy: Project[]) {
    const hostProjectList = document.getElementById(
      `active-projects-list`,
    )! as HTMLUListElement;
    hostProjectList.innerHTML = "";
    projectsCopy.map((p) => {
      let newListItem = document.createElement("li");
      newListItem.textContent = `Title: ${p.title}, Description: ${p.description}, Number of People: ${p.people}`;
      hostProjectList.insertAdjacentElement("beforeend", newListItem);
    });
  }

  configure() {}

  renderContent() {
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`; // For CSS
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
