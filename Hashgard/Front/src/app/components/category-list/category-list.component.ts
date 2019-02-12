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
    this.getList();
  }

  getList() {
    this.categoryError = null;
    this.categoryService.getList().subscribe(
      result => { this._categoryList = result; },
      error => this.categoryError = error.toString()
    );
  }

  create() {
    this.categoryError = null;
    this.categoryService.create(this.newCategoryName).subscribe(
      result => {
        this.newCategoryName = null;
        this.categoryList.push(result);
        this.isWriting = false;
      },
      error => this.categoryError = error.toString()
    );
  }

  open(id: number) {
    this.router.navigate(["/articles", id]);
  }

}
