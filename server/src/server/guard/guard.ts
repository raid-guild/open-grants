import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";

@Injectable()
export class Guard implements CanActivate {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const req = context.switchToHttp().getRequest();
        // console.log("req", req.url, req.headers);
        const url = req.url.split('/');
        const method = req.method;
        // console.log("url", url[1] + '/' + url[2]);
        // console.log("method", method);

        const token = req.headers.authorization;
        let decodeToken;
        if (token) {
            decodeToken = jwt.decode(token.replace('Bearer ', ''));
            // console.log("decodeToken", decodeToken);
            req["user"] = decodeToken;
        }

        if (token && decodeToken && req.user._id) {
            return true;

        }

        return true;

        // throw new HttpException('Authorization error', HttpStatus.UNAUTHORIZED);
    }
}
