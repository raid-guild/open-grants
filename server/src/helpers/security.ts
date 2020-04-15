import { JWTHelper } from '../helpers/jwt.helper';

export class Security {
    excludedUrls = [
        'user/login',
        'user/signup'
    ];

    constructor(private jwtHelper: JWTHelper) { }

    async  securityCheck(req) {
        const url = req.url.split('/');
        const method = req.method;
        console.log("url", url[1] + '/' + url[2]);
        console.log("method", method);

        // if (method === "GET") {
        //     if (this.excludedUrls.indexOf(url[1]) === -1) {
        //         return true;
        //     } else if (req.headers.authorization) {
        //         const user = await this.jwtHelper.getAuthUser(req.headers.authorization);
        //         return user;
        //     }
        // }

        // if (method === "POST") {
        //     if (this.excludedUrls.indexOf(url[1] + '/' + url[2]) > -1) {
        //         console.log("POST");
        //         return true;
        //     } else if (req.headers.authorization) {
        //         const user = await this.jwtHelper.getAuthUser(req.headers.authorization);
        //         return user;
        //     }
        // }

        // if (method === "PUT" || method === "DELETE" && req.headers.authorization) {
        //     const user = await this.jwtHelper.getAuthUser(req.headers.authorization);
        //     return user;
        // }

        // if (this.excludedUrls.indexOf(url[1] + '/' + url[2]) > -1) {
        //     console.log("POST");
        //     return true;
        // } else if (req.headers.authorization) {
        //     const user = await this.jwtHelper.getAuthUser(req.headers.authorization);
        //     return user;
        // }

        return true;

        // const deToken = jwt.decode(req.headers.authorization.replace('Bearer ', ''));
        // const dateNow = new Date();
        // if (deToken.iat > dateNow.getTime() / 1000) {
        //     return false;
        // }
        // return true;
    }

}
