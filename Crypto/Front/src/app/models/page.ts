export class Page<T> {
  public items: T[];
  public index: number;
  public count: number;
  public totalCount: number;

  constructor() {
    this.items = [];
    this.index = 0;
    this.count = 0;
    this.totalCount = 0;
  }

  public addPageBefore(newPage: Page<T>) {
    for (let newItem of newPage.items) {
      this.addItemBefore(newItem);
    }
    this.addPage(newPage);
  }

  public addPageAfter(newPage: Page<T>) {
    for (let newItem of newPage.items) {
      this.addItemAfter(newItem);
    }
    this.addPage(newPage);
  }

  public addItemBefore(newItem: T) {
    this.items.splice(0, 0, newItem);
    this.addItem();
  }

  public addItemAfter(newItem: T) {
    this.items.push(newItem);
    this.addItem();
  }

  private addPage(newPage: Page<T>) {
    this.totalCount = newPage.totalCount;
  }

  private addItem() {
    this.index++;
    this.count++;
  }
}
