export class Page<T> {
  public items: T[];
  public index: number;
  public count: number;
  public totalCount: number;

  constructor() {
    this.items = [];
  }

  public addBefore(newPage: Page<T>) {
    for (let newItem of newPage.items) {
      this.items.splice(0, 0, newItem);
    }
    this.add(newPage);
  }

  public addAfter(newPage: Page<T>) {
    for (let newItem of newPage.items) {
      this.items.push(newItem);
    }
    this.add(newPage);
  }

  private add(newPage: Page<T>) {
    this.index += newPage.count;
    this.count += newPage.count;
    this.totalCount = newPage.totalCount;
  }
}
