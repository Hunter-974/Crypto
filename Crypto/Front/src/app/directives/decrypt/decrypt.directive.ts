import { Directive, ElementRef, TemplateRef, ViewContainerRef, OnInit, Input } from '@angular/core';
import { crypt } from 'src/app/app.module';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

@Directive({
  selector: '[appDecrypt]'
})
export class DecryptDirective implements OnInit {

  @Input("appDecrypt") value: string;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

    ngOnInit() {
      let decrypted = null;
      try {
        decrypted = crypt.decrypt(this.value);
      }
      catch {
        decrypted = null;
      }
      if (decrypted != null) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        var html = CryptoService.encryptedTemplate;
        this.viewContainer.element.nativeElement.outerHTML = html;
      }
    }
}
