import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param } from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import httpStatus = require('http-status');
import { User, authswagger, Loginswagger } from '../user/user.model';
import { AuthService } from './auth.service';
import { Utils } from '../../helpers/utils';
import { JWTHelper } from '../../helpers/jwt.helper';
import {
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiTags

} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService, private utils: Utils) { }

    @Post('/signUp')
    @ApiResponse({ status: 200, description: 'User added successfully.' })
    async signUp(@Res() res, @Body() userModel: User, @Body() userswagger: authswagger) {
        try {
            userModel.password = this.utils.encrypt(userModel.password);

            userModel.userName = userModel.userName.toLocaleLowerCase();
            userModel.email = userModel.email.toLocaleLowerCase();

            let response = await this.authService.add(userModel);
            delete response.password;
            return res.status(httpStatus.OK).json(new APIResponse(response, 'User added successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding user', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Post('/login')
    @ApiResponse({ status: 200, description: 'Login successfully.' })
    async login(@Res() res, @Body() user, @Body() login: Loginswagger) {
        try {
            user.password = this.utils.encrypt(user.password);

            let response = await this.authService.login(user);
            if (response) {
                response = JSON.parse(JSON.stringify(response));
                const token = JWTHelper.getJWTToken({
                    _id: response._id,
                    email: response.email,
                    userName: response.userName
                });

                response = {
                    ...response,
                    token: token
                }
                delete response.password;
                // delete response.privateKey;

                return res.status(httpStatus.OK).json(new APIResponse(response, 'Login successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.UNAUTHORIZED).json(new APIResponse(null, 'Authorizetion error', httpStatus.UNAUTHORIZED));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error user login', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

}