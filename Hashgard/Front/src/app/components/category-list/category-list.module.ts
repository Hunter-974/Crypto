import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
import { ErrorMessageModule } from '../error-message/error-message.module';
import { DirectivesModule } from 'src/app/directives/directives/directives.module';
import { CategoryModule } from '../category/category.module';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Route[] = [
  { path: '', component: CategoryListComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    ErrorMessageModule,
    DirectivesModule,
    CategoryModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CategoryListComponent],
  exports: [
    CategoryListComponent, 
    RouterModule
  ]
})
export class CategoryListModule { }
