import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppSettings } from '../config/app.config';
import { AuthService, AuthState } from './auth.service';
import { HttpHelper } from '../common/http-helper/http-helper.class';
import { HttpClient } from '@angular/common/http';

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends HttpHelper {
  private userData: UserData;
  private userDataSubject = new Subject<UserData>();
  onUserDataChange = this.userDataSubject.asObservable();

  constructor(private auth: AuthService,
    private http: HttpClient) {
    super();
    if (localStorage.getItem(AppSettings.localStorage_keys.userData)) {
      this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
    }
    this.subscriptions();
  }

  subscriptions() {
    this.auth.authState.subscribe((data: AuthState) => {
      if (data.is_logged_in) {
        // this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
        // this.userDataSubject.next(this.userData);
      }
    });
  }

  get getUserData(): UserData {
    return this.userData;
  }

  setUserData(data: UserData): void {
    this.userData = data;
    localStorage.setItem(AppSettings.localStorage_keys.userData, JSON.stringify(this.userData));
    this.userDataSubject.next(this.userData);
  }
}
