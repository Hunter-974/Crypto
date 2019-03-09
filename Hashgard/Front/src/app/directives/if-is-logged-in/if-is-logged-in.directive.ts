import { Directive, ElementRef, TemplateRef, ViewContainerRef, Input, OnInit } from '@angular/core';
import { BaseAuthService } from 'src/app/services/base-auth-service';

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
    if (BaseAuthService.isLoggedIn) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
