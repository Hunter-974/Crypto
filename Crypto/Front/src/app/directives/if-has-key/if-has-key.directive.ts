import { Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { crypt } from 'src/app/app.module';

@Directive({
  selector: '[appIfHasKey]'
})
export class IfHasKeyDirective {

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    if (crypt.hasKey) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
