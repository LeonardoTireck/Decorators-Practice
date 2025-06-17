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

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleEl.value;
    const enteredDescription = this.descriptionEl.value;
    const enteredPeople = this.peopleEl.value;

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert("Invalid input.");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

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
      console.log(title, description, people);
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
