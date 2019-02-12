import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/models/category';
import { Router } from '@angular/router';
import { BaseComponent } from '../base-component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends BaseComponent implements OnInit {

  showEncrypted: boolean = false;
  isWriting: boolean = false;
  newCategoryName: string;
  newSubCategoryName: string;
  categoryError: string;
  subCategoryError: string;
  openedParentId: number;

  _categoryList: Category[];
  get categoryList(): Category[] {
    if (!this._categoryList) {
      return null;
    } else if (this.showEncrypted) {
      return this._categoryList;
    } else {
      var decryptedCategoryList: Category[] = [];
      this._categoryList.map(c => {
        if (this.isDecrypted(c.name)) {
          decryptedCategoryList.push(c);
        }
      });
      return decryptedCategoryList;
    }
  }

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { 
    super();
  }

  ngOnInit() {
    this.getParentList();
  }

  getParentList() {
    this.categoryError = null;
    this.categoryService.getParents().subscribe(
      result => { this._categoryList = result; },
      error => { this.categoryError = error.toString(); }
    );
  }

  getChildrenList(parent: Category) {
    this.subCategoryError = null;
    this.categoryService.getChildren(parent.id).subscribe(
      result => {
        parent.children = result;
        parent.isOpened = true;
      },
      error => {
        parent.error = error.toString();
        parent.isOpened = true;
      }
    );
  }

  createParent() {
    this.categoryError = null;
    this.categoryService.createParent(this.newCategoryName).subscribe(
      result => {
        this.newCategoryName = null;
        this.categoryList.push(result);
        this.isWriting = false;
      },
      error => { this.categoryError = error.toString(); }
    );
  }

  createChild(parent: Category) {
    parent.error = null;
    this.categoryService.createChild(parent.id, parent.newText).subscribe(
      result => {
        parent.newText = null;
        parent.children.push(result);
        parent.isWriting = false;
      },
      error => { parent.error = error.toString(); }
    );
  }

  openParent(parent: Category) {
    if (parent.isOpened) {
      parent.isOpened = false;
    } else {
      parent.isOpened = true;
      this.getChildrenList(parent);
    }
  }

  openChild(childId: number) {
    this.router.navigate(["/articles", childId]);
  }

}
