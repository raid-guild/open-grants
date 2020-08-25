import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[MobileNumber]'
})
export class MobileNumberDirective {

  private keyCodesAllowedException = [107]
  private keyCodesAllowedWithShiftException = [57, 48, 187]

  constructor(private el: ElementRef) {

  }

  @Input() MobileNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    let e = <KeyboardEvent>event;

    if (this.MobileNumber) {
      if (
        [8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        // let it happen, don't do anything
        return;
      }

      // Allowed Exceptions
      // Allow: (, ), +
      if (e.shiftKey && this.keyCodesAllowedWithShiftException.indexOf(e.keyCode) > -1 ||
        this.keyCodesAllowedException.indexOf(e.keyCode) > -1) {
        // Allowed
      } else if (e.shiftKey || ((e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        // Ensure that it is a number and stop the keypress
        e.preventDefault();
      }
    }
  }
}
