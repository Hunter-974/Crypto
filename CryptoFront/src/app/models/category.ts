import { Article } from "src/app/models/article";

export class Category {
    public id: number;
    public name: string;
    public children: Category[];
    public articles: Article[];
}
