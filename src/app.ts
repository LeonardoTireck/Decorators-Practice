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

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleEl.value);
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
