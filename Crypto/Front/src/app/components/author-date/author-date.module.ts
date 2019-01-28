import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorDateComponent } from './author-date.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AuthorDateComponent],
  exports: [AuthorDateComponent]
})
export class AuthorDateModule { }
