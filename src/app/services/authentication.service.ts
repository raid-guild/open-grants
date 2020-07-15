import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelper, HTTPRESPONSE } from '../common/http-helper/http-helper.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../config/app.config';
import { AuthService } from './auth.service';
import { UserManagementService } from './user-management.service';
import * as Web3 from 'web3';
import { ethers, providers, utils } from 'ethers';

@Injectable()
export class AuthenticationService extends HttpHelper {

    constructor(
        private http: HttpClient,
        private userManagementService: UserManagementService,
        private authService: AuthService
    ) {
        super();
    }

    // confirmUser(data: { publicAddress: string }): Observable<any> {
    //     return this.http.post(`${this.apiUrl}/auth/confirmUser`, data);
    // }

    // signin(data: { publicAddress: string, signature: string }): Observable<any> {
    //     return this.http.post(`${this.apiUrl}/auth/login`, data)
    //         .pipe(
    //             map((res: HTTPRESPONSE) => {
    //                 localStorage.setItem(AppSettings.localStorage_keys.token, res.data.token);
    //                 delete res.data.token;
    //                 this.userManagementService.setUserData(res.data);
    //                 this.authService.setAuthState({ is_logged_in: true });
    //                 return res;
    //             })
    //         );
    // }
}
