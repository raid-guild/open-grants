import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { AppSettings } from '../config/app.config';
import { Events } from '@ionic/angular';

export interface AuthState {
    is_logged_in: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private authSubject = new Subject<AuthState>();
    authState = this.authSubject.asObservable();
    private applicationAuthState: AuthState;

    constructor(
        public events: Events,
    ) {
        this.applicationAuthState = {
            is_logged_in: AuthService.isAuthenticated()
        };
    }

    static isAuthenticated(): boolean {
        // @todo ===> check token expire time here to determine if token is expired or not <===
        return !!localStorage.getItem(AppSettings.localStorage_keys.userEthAddress);
    }

    setAuthState(data) {
        this.applicationAuthState = data;
        this.authSubject.next(data);
        this.events.publish('is_logged_in', data.is_logged_in);
    }

    getAuthUserId() {
        const userEthAddress = localStorage.getItem(AppSettings.localStorage_keys.userEthAddress);
        if (userEthAddress) {
            return userEthAddress;
        } else {
            return null;
        }
    }

    getAuthState(): AuthState {
        return this.applicationAuthState;
    }

    logout() {
        localStorage.removeItem(AppSettings.localStorage_keys.userEthAddress);
        localStorage.clear();
        this.setAuthState({ is_logged_in: false });
    }

}
