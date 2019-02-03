import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms'
import { ErrorMessageModule } from '../error-message/error-message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorMessageModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule { }
