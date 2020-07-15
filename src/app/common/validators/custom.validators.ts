import { AbstractControl } from '@angular/forms';

declare let window: any;

export function addressValidator(control: AbstractControl) {
    if (window.web3.isAddress(control.value.toLowerCase())) {
        return null;
    }
    return { addressValid: true };
}