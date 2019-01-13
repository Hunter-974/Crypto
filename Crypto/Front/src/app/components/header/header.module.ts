import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { LoginModule } from '../login/login.module';
import { KeyModule } from '../key/key.module';

@NgModule({
  imports: [
    CommonModule, KeyModule, LoginModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule { }
