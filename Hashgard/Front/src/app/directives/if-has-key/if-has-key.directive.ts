import { Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

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
    if (CryptoService.hasKey) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
