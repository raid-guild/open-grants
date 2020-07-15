import { HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../config/app.config';
import { ENVIRONMENT } from '../../../environments/environment';

export enum APIStatus {
    SUCCESS = 200,
    FAILURE = 500,
    EXCEPTION = 400,
    UNAUTHORIZED = 401
}

export interface CustomHttpHeaderOptions {
    loader?: boolean;
    errorMessage?: boolean;
    token?: boolean;
    X_Lang?: boolean;
    isJSONRequest?: boolean;
    isMultiPart?: boolean;
    additionalParams?: Array<{ name: string, value: string }>;
}

export interface HTTPRESPONSE {
    data: any;
    exception: any;
    message: string;
    status: APIStatus;
}

export type Boolean_number_range = 0 | 1;

export class HttpHelper {

    protected apiUrl = '';

    constructor() {
        this.apiUrl = ENVIRONMENT.API_ENDPOINT;
    }

    protected getHttpOptions(options?: CustomHttpHeaderOptions) {

        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Authorization', localStorage.getItem(AppSettings.localStorage_keys.userEthAddress) || 'Bearer ');

        if (options && options.loader === false) {
            headers = headers.append('InterceptorNoLoader', '');
        }

        if (options && options.errorMessage === false) {
            headers = headers.append('InterceptorNoErrorMessage', '');
        }

        if (options && options.token === false) {
            headers = headers.delete('Authorization');
        }

        if (options && options.isJSONRequest === false) {
            headers = headers.delete('Content-Type');
        } else {
            headers = headers.append('Content-Type', 'application/json');
        }

        if (options && options.hasOwnProperty('additionalParams')) {
            options.additionalParams.map((param) => {
                headers = headers.append(param.name, param.value);
            });
        }

        const httpOptions = {
            headers
        };

        return httpOptions;
    }

}