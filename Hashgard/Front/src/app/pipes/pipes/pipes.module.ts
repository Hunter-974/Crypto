import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncryptPipe } from '../encrypt/encrypt.pipe';
import { DecryptPipe } from '../decrypt/decrypt.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EncryptPipe, DecryptPipe],
  exports: [EncryptPipe, DecryptPipe]
})
export class PipesModule { }
