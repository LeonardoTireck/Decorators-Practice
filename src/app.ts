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

// The following code is commented out because I'm taking a different approach and setting a global state much like
// front-end frameworks such as React and Angular.
// class Project {
//   public title: string;
//   public description: string;
//   public people: number;
//   public type: "active" | "finished";
//   public templateElement: HTMLTemplateElement;
//   public hostElement: HTMLElement;
//   public listItem: HTMLElement;
//   constructor(
//     title: string,
//     description: string,
//     people: number,
//     type: "active" | "finished",
//   ) {
//     this.title = title;
//     this.description = description;
//     this.people = people;
//     this.type = type;
//     this.templateElement = document.getElementById(
//       "single-project",
//     )! as HTMLTemplateElement;
//     this.hostElement = document.getElementById(
//       "active-projects-list",
//     )! as HTMLElement;
//     this.listItem = document.importNode(this.templateElement.content, true)
//       .firstElementChild as HTMLElement;
//     this.listItem.textContent = `Title: ${this.title}, Description: ${this.description}, People: ${this.people}`;
//
//     this.attach();
//   }
//   private attach() {
//     this.hostElement.insertAdjacentElement("afterbegin", this.listItem);
//   }
// }

// Instead of the approach above, I'll try to create a class that will manage the state of the application.

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
    for (const observer of this.observers) {
      const projectsCopy = this.projects.slice();
      observer.update(projectsCopy);
    }
    console.log(this.projects);
  }

  public addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople,
    };
    this.projects.push(newProject);
    this.notify();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return new ProjectState();
  }
}

const projectState = ProjectState.getInstance();

class Project {
  public templateElement: HTMLTemplateElement;
  public hostElement: HTMLElement;
  public listItem: HTMLElement;
  public title: string;
  public description: string;
  public people: number;
  constructor(title: string, description: string, people: number) {
    this.templateElement = document.getElementById(
      "single-project",
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(
      "active-projects-list",
    )! as HTMLElement;
    this.listItem = document.importNode(this.templateElement.content, true)
      .firstElementChild as HTMLElement;
    this.title = title;
    this.description = description;
    this.people = people;
    this.listItem.textContent = `Title: ${this.title}, Description: ${this.description}, People: ${this.people}`;

    this.attach();
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.listItem);
  }
}

class ProjectList implements Observer {
  public templateElement: HTMLTemplateElement;
  public hostElement: HTMLDivElement;
  public element: HTMLElement;
  // private assignedProjects: any[] = [];
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list",
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // const importedNode = document.importNode(
    //   this.templateElement.content,
    //   true,
    // ).firstElementChild;
    this.element = document.importNode(this.templateElement.content, true)
      .firstElementChild as HTMLElement;

    this.renderContent();
    this.attach();
  }

  update(project: any) {
    console.log("Reacting to event ");
    const ulElement = document.getElementById(
      "active-projects-list",
    )! as HTMLUListElement;
    while (ulElement.firstChild) {
      ulElement.removeChild(ulElement.firstChild);
    }
    project.map((p: any) => {
      console.log(p);
      new Project(p.title, p.description, p.people);
    });
  }

  private renderContent() {
    this.element.id = this.type + "-projects";
    this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  public templateElement: HTMLTemplateElement;
  public hostElement: HTMLDivElement;
  public element: HTMLFormElement;
  public titleEl: HTMLInputElement;
  public descriptionEl: HTMLInputElement;
  public peopleEl: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input",
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true,
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;

    this.element.id = "user-input";

    this.titleEl = this.element.querySelector("#title")! as HTMLInputElement;
    this.descriptionEl = this.element.querySelector(
      "#description",
    )! as HTMLInputElement;
    this.peopleEl = this.element.querySelector("#people")! as HTMLInputElement;

    this.configure();

    this.attach();
  }

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
      // let newProject = new Project(title, description, people, "active"); Old approach
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
const activeProjectsList = new ProjectList("active");
const fineshedProjectsList = new ProjectList("finished");
projectState.attach(activeProjectsList);
