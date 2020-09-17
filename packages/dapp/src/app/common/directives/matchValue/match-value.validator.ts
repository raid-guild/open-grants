import { FormGroup } from '@angular/forms';
// custom validator to check that two fields match
export function MatchValue(
  firstControlName: string,
  secondControlName: string,
) {
  return (formGroup: FormGroup) => {
    const firstControl = formGroup.controls[firstControlName];
    const secondControl = formGroup.controls[secondControlName];
    // return null if controls haven't initialised yet
    if (!firstControl || !secondControl) {
      return null;
    }
    if (secondControl.errors && !secondControl.errors.matchValueError) {
      return null;
    }

    if ((firstControl && !secondControl) || (!firstControl && secondControl)) {
      secondControl.setErrors({ matchValueError: true });
    }

    if (firstControl.value !== secondControl.value) {
      secondControl.setErrors({ matchValueError: true });
    } else {
      secondControl.setErrors(null);
    }
  };
}
