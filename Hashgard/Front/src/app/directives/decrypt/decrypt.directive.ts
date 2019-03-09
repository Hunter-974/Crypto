import { Directive, ElementRef, ViewContainerRef, Input, OnChanges } from '@angular/core';
import { CryptoService, decrypt } from 'src/app/services/crypto/crypto.service';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appDecrypt]'
})
export class DecryptDirective implements OnChanges {

  @Input("appDecrypt") value: string;

  constructor(
    private domSanitizer: DomSanitizer,
    private element: ElementRef,
    private viewContainer: ViewContainerRef) { }

    ngOnChanges() {
      let decrypted = null;
      try {
        decrypted = decrypt(this.value);
      }
      catch {
        decrypted = null;
      }
      if (decrypted != null) {
        this.viewContainer.element.nativeElement.outerHTML = decrypted;
      } else {
        var html = this.domSanitizer.bypassSecurityTrustHtml(CryptoService.encryptedTemplate);
        this.viewContainer.element.nativeElement.outerHTML = html;
      }
    }
}
