import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelper, HTTPRESPONSE } from '../common/http-helper/http-helper.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../config/app.config';
import { AuthService } from './auth.service';
import { UserManagementService } from './user-management.service';

@Injectable()
export class AuthenticationService extends HttpHelper {
    user: any;

    constructor(private http: HttpClient,
        private userManagementService: UserManagementService,
        private authService: AuthService) {
        super();

        this.user = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
    }

    signin(data: { userName: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, data)
            .pipe(
                map((res: HTTPRESPONSE) => {
                    // delete res.data.privateKey;
                    localStorage.setItem(AppSettings.localStorage_keys.token, res.data.token);
                    delete res.data.token;
                    delete res.data.picture;
                    this.userManagementService.setUserData(res.data);
                    this.authService.setAuthState({ is_logged_in: true });
                    return res;
                })
            );
    }

    getUserData(): Observable<any> {
        return this.http.get(`${this.apiUrl}/user/${this.user._id}`, this.getHttpOptions())
    }

    signup(data: { [key: string]: any }): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/signUp`, data).pipe(
            map((res: HTTPRESPONSE) => {
                // localStorage.setItem(AppSettings.localStorage_keys.token, res.data.token);
                // this.authService.setAuthState({ is_logged_in: true });
                return res;
            })
        );
    }

}
