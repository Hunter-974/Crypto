import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categoryList: Category[];
  newCategoryName: string;
  newSubCategoryName: string;
  categoryError: string;
  subCategoryError: string;
  openedParentId: number;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getParentList();
  }

  getParentList() {
    this.categoryError = null;
    this.categoryService.getParents().subscribe(
      result => { this.categoryList = result; },
      error => { this.categoryError = error.toString(); }
    );
  }

  getChildrenList(parent: Category) {
    this.subCategoryError = null;
    this.categoryService.getChildren(parent.id).subscribe(
      result => {
        parent.children = result;
        this.openedParentId = parent.id;
      },
      error => {
        this.subCategoryError = error.toString();
        this.openedParentId = parent.id;
      }
    );
  }

  createParent() {
    this.categoryError = null;
    this.categoryService.createParent(this.newCategoryName).subscribe(
      result => {
        this.newCategoryName = null;
        this.getParentList()
      },
      error => { this.categoryError = error.toString(); }
    );
  }

  createChild(parent: Category) {
    this.subCategoryError = null;
    this.categoryService.createChild(parent.id, this.newSubCategoryName).subscribe(
      result => {
        this.newSubCategoryName = null;
        this.getChildrenList(parent)
      },
      error => { this.subCategoryError = error.toString(); }
    );
  }

  openParent(parent: Category) {
    if (this.openedParentId == parent.id) {
      this.openedParentId = null;
    } else {
      this.getChildrenList(parent);
    }
  }

  openChild(childId: number) {
    this.router.navigate(["/articles", childId]);
  }

}
