import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';

@NgModule({
  declarations: [],
  imports: [CommonModule]
})
export class <%= classify(name) %>Module {
  constructor(@Optional() @SkipSelf() parentModule: <%= classify(name) %>Module) {
    throwIfAlreadyLoaded(parentModule, '<%= classify(name) %>Module');
  }
}
