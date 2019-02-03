import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

  @Input() category: Category;

  @Output() categoryClick: EventEmitter<Category> = new EventEmitter<Category>();
  
  onclick() {
    this.categoryClick.emit(this.category);
  }
}
