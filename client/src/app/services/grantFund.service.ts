import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelper } from '../common/http-helper/http-helper.class';
import { Observable } from 'rxjs';
import { AppSettings } from '../config/app.config';

export interface IGrantFund {
    _id?: string;
    grant: String;
    amount: number;
}

@Injectable()
export class GrantFundService extends HttpHelper {

    user: any;
    constructor(private http: HttpClient) {
        super();
        this.user = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
    }

    addGrantFund(data: IGrantFund): Observable<any> {
        return this.http.post(this.apiUrl + '/grantFund', data, this.getHttpOptions());
    }

    getGrantFundedByMe(): Observable<any> {
        return this.http.get(this.apiUrl + '/grantFund/fundedByMe', this.getHttpOptions());
    }

    getGrantFundTask(grantId: string): Observable<any> {
        return this.http.get(this.apiUrl + '/grantFund/fundingTaskByGrantAndUser/' + grantId, this.getHttpOptions());
    }
}
