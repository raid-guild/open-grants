import { NgModule } from '@angular/core';
import {OnlyNumber} from './numberOnly.directive';
import {MobileNumberDirective} from './mobileNumber.directive';
import {TextOnlyDirective} from './textOnly.directive';

@NgModule({
  declarations: [OnlyNumber, MobileNumberDirective, TextOnlyDirective],
  exports: [OnlyNumber, MobileNumberDirective, TextOnlyDirective]
})
export class NumberonlyDirectiveModule {}
