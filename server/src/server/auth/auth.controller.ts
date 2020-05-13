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

import * as ethUtil from 'ethereumjs-util';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService, private utils: Utils) { }

    @Post('/confirmUser')
    @ApiResponse({ status: 200, description: 'User fetched successfully.' })
    async login(@Res() res, @Body() userModel: User) {
        try {
            let response = await this.authService.getByPublicAddress(userModel.publicAddress);
            console.log("response", response);
            if (!response) {
                response = await this.authService.add(userModel);
            }
            return res.status(httpStatus.OK).json(new APIResponse(response, 'User fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error fetching user', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Post('/login')
    @ApiResponse({ status: 200, description: 'Login successfully.' })
    async verifySign(@Res() res, @Body() body) {
        try {
            let response = await this.authService.getByPublicAddress(body.publicAddress);
            if (response) {
                const msg = `I am signing my one-time nonce: ${response.nonce}`;

                // const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
                // const address = sigUtil.recoverPersonalSignature({
                //     data: msgBufferHex,
                //     sig: body.signature
                // });

                const msgBuffer = Buffer.from(msg, 'utf8');

                const msgHash = ethUtil.hashPersonalMessage(msgBuffer);

                const signatureBuffer: any = ethUtil.toBuffer(body.signature);

                const signatureParams = ethUtil.fromRpcSig(signatureBuffer);

                const publicKey = ethUtil.ecrecover(
                    msgHash,
                    signatureParams.v,
                    signatureParams.r,
                    signatureParams.s
                );

                const addressBuffer = ethUtil.publicToAddress(publicKey);
                const address = ethUtil.bufferToHex(addressBuffer);

                if (address.toLowerCase() === body.publicAddress.toLowerCase()) {
                    response.nonce = Math.floor(Math.random() * 1000000);
                    await response.save();
                    response = JSON.parse(JSON.stringify(response));
                    const token = JWTHelper.getJWTToken({
                        _id: response._id,
                        publicAddress: response.publicAddress
                    });

                    response = {
                        ...response,
                        token: token
                    }

                    return res.status(httpStatus.OK).json(new APIResponse(response, 'Login successfully', httpStatus.OK));
                }
                return res.status(httpStatus.UNAUTHORIZED).json(new APIResponse(null, 'Authorizetion error', httpStatus.UNAUTHORIZED));

            } else {
                return res.status(httpStatus.UNAUTHORIZED).json(new APIResponse(null, 'Authorizetion error', httpStatus.UNAUTHORIZED));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error user login', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

}