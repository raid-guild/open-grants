import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';

@Injectable()
export class HttpCommonInterceptor implements HttpInterceptor {

    constructor(private utils: UtilsService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const LoaderDisabled = req.headers.has('InterceptorNoLoader');
        const ErrMessageDisabled = req.headers.has('InterceptorNoErrorMessage');
        const LanguageHeaderDisabled = req.headers.has('InterceptorNoXLang');

        let headers = req.headers;
        let request = req.clone();

        if (LoaderDisabled) {
            headers = headers.delete('InterceptorNoLoader');
        } else {
            this.utils.startLoader();
        }

        if (ErrMessageDisabled) {
            headers = headers.delete('InterceptorNoErrorMessage');
        }

        if (LanguageHeaderDisabled) {
            headers = headers.delete('InterceptorNoXLang');
        } else {
            // headers = headers.append('X-Lang', this.com.getDefaultLanguage().code);
        }

        if (headers) {
            request = req.clone({ headers: headers });
        }

        return next
            .handle(request)
            .pipe(
                tap((ev: any) => {
                    if (ev instanceof HttpResponse) {
                        // HTTP Response
                        if (!LoaderDisabled) {
                            this.utils.stopLoader();
                        }
                    }
                }, (error: any) => {

                    if (error instanceof HttpErrorResponse) {
                        if (!LoaderDisabled) {
                            this.utils.stopLoader();
                        }
                        // if (error.status == 401) { // token invalidated
                        //     this.event.publish('TOKEN_EXPIRED');
                        // }
                        // else {

                        //     if (!ErrMessageDisabled) {
                        //         if (error.status != 509) {
                        //             let msg = error.error.message;
                        //             if (error.error.validation_errors) {
                        //                 for (let eMsg in error.error.validation_errors) {
                        //                     msg = error.error.validation_errors[eMsg][0];
                        //                 }
                        //             }
                        //             //
                        //             if (msg) {
                        //                 this.com.toastMessage(msg);
                        //             }
                        //         }
                        //     }
                        // }
                    }
                })
            );
    }
}
