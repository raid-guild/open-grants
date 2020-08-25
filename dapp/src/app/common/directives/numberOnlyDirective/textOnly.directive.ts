import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[TextOnly]'
})
export class TextOnlyDirective {

  constructor(private el: ElementRef) {

  }

  @Input() TextOnly: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    let e = <KeyboardEvent>event;

    if (this.TextOnly) {
      if (
        [8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
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

      if ((e.keyCode < 65 || e.keyCode > 90)) {
        // Ensure that it is a number and stop the keypress
        e.preventDefault();
      }
    }
  }
}
