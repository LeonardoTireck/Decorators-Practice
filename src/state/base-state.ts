export interface Observer {
  update(...args: any[]): void;
}

// Creating a base class for managing state.
export abstract class State {
  protected observers: Observer[] = [];

  public attach(observer: Observer) {
    // check if observer is already attached
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log("Observer already attached.");
    } else {
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
