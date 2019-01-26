import { Directive, ElementRef, TemplateRef, ViewContainerRef, Input, OnInit } from '@angular/core';
import {  auth } from 'src/app/app.module';

@Directive({
  selector: '[appIfIsLoggedIn]'
})
export class IfIsLoggedInDirective implements OnInit {

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
      
  }

  ngOnInit() {
    if (auth.isLoggedIn) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
