import { AbstractControl } from '@angular/forms';
import { utils } from 'ethers';

export function addressValidator(control: AbstractControl) {
  let addressInvalid;

  try {
    utils.getAddress(control.value.toLowerCase());
  } catch (error) {
    addressInvalid = true;
  }

  return addressInvalid ? { addressInvalid: true } : null;
}
