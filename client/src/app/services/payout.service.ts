import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelper } from '../common/http-helper/http-helper.class';
import { Observable } from 'rxjs';
import { AppSettings } from '../config/app.config';

@Injectable()
export class PayoutService extends HttpHelper {

    constructor(private http: HttpClient) {
        super();
    }

    request(data: any): Observable<any> {
        return this.http.post(this.apiUrl + '/payout/request', data, this.getHttpOptions());
    }

    approve(data: { requestId: string, hash: string }): Observable<any> {
        return this.http.post(this.apiUrl + '/payout/approve', data, this.getHttpOptions());
    }

    rejecte(data: { requestId: string }): Observable<any> {
        return this.http.post(this.apiUrl + '/payout/rejecte', data, this.getHttpOptions());
    }

    getAll(): Observable<any> {
        return this.http.get(this.apiUrl + '/payout/request', this.getHttpOptions())
    }

    getById(Id: any): Observable<any> {
        return this.http.get(this.apiUrl + '/payout/request/' + Id, this.getHttpOptions())
    }

    getByUserAndGrant(grantId: string): Observable<any> {
        return this.http.get(this.apiUrl + '/payout/request/getByUserAndGrant/' + grantId, this.getHttpOptions());
    }

    getByGrant(grantId: string): Observable<any> {
        return this.http.get(this.apiUrl + '/payout/request/getByGrant/' + grantId, this.getHttpOptions());
    }

    getByGrantee(): Observable<any> {
        return this.http.get(this.apiUrl + '/payout/request/getByGrantee', this.getHttpOptions());
    }
}
