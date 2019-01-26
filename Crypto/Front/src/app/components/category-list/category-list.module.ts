import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
import { ErrorMessageModule } from '../error-message/error-message.module';
import { DirectivesModule } from 'src/app/directives/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    ErrorMessageModule,
    DirectivesModule
  ],
  declarations: [CategoryListComponent],
  exports: [CategoryListComponent]
})
export class CategoryListModule { }
