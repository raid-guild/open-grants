import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

export interface ILoader {
  loading: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private loaderSubscription = new Subject<ILoader>();
  onLoaderChange = this.loaderSubscription.asObservable();

  private loadersCount = 0;

  constructor() {}

  startLoader(message: string = '') {
    if (!this.loadersCount) {
      this.loaderSubscription.next({ loading: true, message });
    }
    this.loadersCount += 1;
  }

  stopLoader() {
    if (this.loadersCount) {
      this.loadersCount -= 1;
    }

    if (!this.loadersCount) {
      this.loaderSubscription.next({ loading: false, message: '' });
    }
  }

  getFormControlValues(form: FormGroup, controlName: string) {
    const control = form.controls[controlName];
    if (control) {
      return control.value;
    } else {
      return undefined;
    }
  }
}
