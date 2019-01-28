import { Component, OnInit, ContentChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { Page } from 'src/app/models/page';
import { Observable } from 'rxjs';
import { BaseComponent } from '../base-component';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent extends BaseComponent implements OnInit {
  page: Page<any>
  pageCount: number;
  displayedPageIndex: number;
  isEditing: boolean;

  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;
  
  @Input() getMethod: (pageIndex, pageSize) => Observable<Page<any>>;
  @Input() pageSize: number;
  @Input() containerClass: string;

  @Output() error: EventEmitter<any> = new EventEmitter<any>();
  @Output() pageChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
   }

  ngOnInit() {
    this.get(0);
  }

  get(pageIndex: number) {
    this.getMethod(pageIndex, this.pageSize).subscribe(
      result => {
        this.page = result;
        this.pageCount = Math.ceil(this.page.totalCount / this.pageSize);
        this.displayedPageIndex = result.index + 1;
        this.pageChanged.emit(result);
      },
      error => {
        this.error.emit(error);
      }
    );
  }

  previous() {
    if (this.page.index > 0) {
      this.get(this.page.index - 1);
    }
  }

  next() {
    if (this.page.index < this.pageCount - 1) {
      this.get(++this.page.index);
    }
  }

  setPageIndex() {
    if (this.displayedPageIndex < 1) {
      this.page.index = 0;
    } else if (this.displayedPageIndex > this.pageCount) {
      this.page.index = this.pageCount - 1;
    } else {
      this.page.index = this.displayedPageIndex - 1;
    }
    this.get(this.page.index);
    this.isEditing = false;
  }
}
