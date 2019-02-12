import { Article } from "src/app/models/article";

export class Category {
  public id: number;
  public name: string;
  public articles: Article[];

  public isWriting: boolean;
  public newText: string;
  public error: string;
}
