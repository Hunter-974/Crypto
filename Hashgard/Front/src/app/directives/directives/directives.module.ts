import { NgModule } from '@angular/core';
import { DecryptDirective } from '../decrypt/decrypt.directive';
import { IfHasKeyDirective } from '../if-has-key/if-has-key.directive';
import { IfIsOwnerDirective } from '../if-is-owner/if-is-owner.directive';
import { IfIsLoggedInDirective } from '../if-is-logged-in/if-is-logged-in.directive';

@NgModule({
  exports: [
    DecryptDirective,
    IfHasKeyDirective,
    IfIsLoggedInDirective,
    IfIsOwnerDirective
  ],
  declarations: [
    DecryptDirective,
    IfHasKeyDirective,
    IfIsLoggedInDirective,
    IfIsOwnerDirective
  ]
})
export class DirectivesModule { }
