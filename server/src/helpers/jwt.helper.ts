import * as jwt from "jsonwebtoken";
import { UserService } from '../server/user/user.service';
import config = require('../config');

export class JWTHelper {
    constructor(private userService: UserService) { }

    static getData(token) {
        return jwt.decode(token.replace('Bearer ', ''));
    }

    static getJWTToken(data: any) {
        const token = `Bearer ${jwt.sign(data, config.jwtSecret)}`;
        return token;
    }

    // async getAuthUser(token) {
    //     try {
    //         const tokenData = JWTHelper.getData(token);
    //         // console.log('tokeData', tokenData.id);
    //         const user = await this.userService.getById(tokenData.id);
    //         // console.log("user123", user);
    //         // const resUser = JSON.parse(JSON.stringify(user));
    //         // delete resUser.password;
    //         return user;
    //     } catch (e) {
    //         return null;
    //     }
    // }
}
