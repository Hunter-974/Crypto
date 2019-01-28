import { Directive, Input, OnInit, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { BaseAuthService } from 'src/app/services/base-auth-service';

@Directive({
  selector: '[appIfIsOwner]'
})
export class IfIsOwnerDirective implements OnInit {

  @Input("appIfHasKey") model: any;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {

    }

    ngOnInit() {
      if (BaseAuthService.isOwner(this.model)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }

}
