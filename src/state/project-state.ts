import { Project } from "../models/project.js";
import { State } from "./base-state.js";

export class ProjectState extends State {
  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {
    super();
  }

  public notify() {
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

  get allProjects() {
    return this.projects;
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
}

export const projectState = ProjectState.getInstance();
