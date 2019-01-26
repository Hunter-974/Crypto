import { Directive, ElementRef, TemplateRef, ViewContainerRef, OnInit, Input } from '@angular/core';
import { crypt } from 'src/app/app.module';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appDecrypt]'
})
export class DecryptDirective implements OnInit {

  @Input("appDecrypt") value: string;

  constructor(
    private domSanitizer: DomSanitizer,
    private element: ElementRef,
    private viewContainer: ViewContainerRef,
    private templateRef?: TemplateRef<any>) { }

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
        var html = this.domSanitizer.bypassSecurityTrustHtml(CryptoService.encryptedTemplate);
        this.viewContainer.element.nativeElement.outerHTML = html;
      }
    }
}
