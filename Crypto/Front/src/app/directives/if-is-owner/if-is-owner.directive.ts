import { Directive, Input, OnInit, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { auth } from 'src/app/app.module';

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
      if (auth.isOwner(this.model)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }

}
