import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHelper } from '../common/http-helper/http-helper.class';
import { Observable } from 'rxjs';
import { AppSettings } from '../config/app.config';

export interface IGrant {
    _id: string;
    grantName: String;
    grantLink: string;
    type: string;
    singleDeliveryDate: {
        fundingExpiryDate: Date,
        completionDate: Date,
    };
    multipleMilestones: [{
        milestoneNumber: any,
        completionDate: Date
    }];
    grantManager: string;
    grantees: Array<string>;
    grantAmount: number;
    totalFund: number;
    currency: string;
    createdBy: string;
}

@Injectable()
export class GrantService extends HttpHelper {

    constructor(private http: HttpClient) {
        super();
    }

    createGrant(data: any): Observable<any> {
        return this.http.post(this.apiUrl + '/grant', data, this.getHttpOptions());
    }

    cancelGrant(data: { grant: string, hash: string }): Observable<any> {
        return this.http.post(this.apiUrl + '/cancelRequest', data, this.getHttpOptions());
    }

    getAll(): Observable<any> {
        return this.http.get(this.apiUrl + '/grant', this.getHttpOptions())
    }

    getById(Id: any): Observable<any> {
        return this.http.get(this.apiUrl + '/grant/get/' + Id, this.getHttpOptions())
    }

    getGrantCreatedByMe(): Observable<any> {
        return this.http.get(this.apiUrl + '/grant/createdByMe', this.getHttpOptions());
    }

    getGrantFundedByMe(): Observable<any> {
        return this.http.get(this.apiUrl + '/grant/fundedByMe', this.getHttpOptions());
    }

    getGrantManagedByMe(): Observable<any> {
        return this.http.get(this.apiUrl + '/grant/managedByMe', this.getHttpOptions());
    }

    getTrendingGrants(): Observable<any> {
        return this.http.get(this.apiUrl + '/grant/trendingGrants', this.getHttpOptions());
    }
}
