import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Route[] = [
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent],
  exports: [
    RouterModule
  ]
})
export class HomeModule { }
