import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../config/app.config';
import { AuthService, AuthState } from './auth.service';
import { HttpHelper } from '../common/http-helper/http-helper.class';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends HttpHelper {
  private userEthAddress: string;
  private userDataSubject = new Subject<string>();
  onUserDataChange = this.userDataSubject.asObservable();

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
    super();
    if (localStorage.getItem(AppSettings.localStorage_keys.userEthAddress)) {
      this.userEthAddress = localStorage.getItem(AppSettings.localStorage_keys.userEthAddress);
    }
    this.subscriptions();
  }

  subscriptions() {
    this.auth.authState.subscribe((data: AuthState) => {
      if (data.is_logged_in) {
        // this.userEthAddress = localStorage.getItem(AppSettings.localStorage_keys.userData);
        // this.userDataSubject.next(this.userEthAddress);
      }
    });
  }

  get getUserEthAddress() {
    return this.userEthAddress;
  }

  setUserEthAddress(data): void {
    this.userEthAddress = data;
    localStorage.setItem(AppSettings.localStorage_keys.userEthAddress, this.userEthAddress);
    this.userDataSubject.next(this.userEthAddress);
  }
}
