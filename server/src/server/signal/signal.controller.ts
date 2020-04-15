import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import { Guard } from '../guard/guard';
import httpStatus = require('http-status');
import { SignalService } from './signal.service';
import { Signal } from './signal.model';
import {
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiTags

} from '@nestjs/swagger';

@ApiTags('Signal')
@Controller('api/v1/signal')
@UseGuards(Guard)
export class SignalController {

    constructor(
        private signalService: SignalService
    ) { }

    @Post('')
    async add(@Req() req, @Res() res, @Body() signalModel: Signal) {
        try {
            signalModel.user = req.user._id;

            let response = await this.signalService.getUserAndGrant(signalModel.user, signalModel.grant);
            if (response) {
                response.signal = !response.signal
                response = await response.save();
            } else {
                response = await this.signalService.signal(signalModel);
            }
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Signal added successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding signal', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Retrieve list
    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Signals fetched successfully' })
    async getAll(@Req() req, @Res() res) {
        try {
            let response = await this.signalService.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Signals fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Getting Signals', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Fetch a particular user using id
    @Get('get/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Signal fetched successfully' })
    async getById(@Res() res, @Param('id') signalId) {
        try {
            let response = await this.signalService.getById(signalId);

            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Signal fetched successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting signal', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }


    @Get('getGrantSignals/:id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Grants fetched successfully' })
    async getGrantSignals(@Req() req, @Res() res, @Param('id') grantId) {
        try {
            let response = await this.signalService.getByGrant(grantId);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Signal fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting signal', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('getByUserAndGrant/:id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Grants fetched successfully' })
    async getByUserAndGrant(@Req() req, @Res() res, @Param('id') grantId) {
        try {
            let response = await this.signalService.getByUserAndGrant(req.user._id, grantId);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Signal fetched successfully', httpStatus.OK));
            }
            return res.status(httpStatus.OK).json(new APIResponse({}, 'Signal fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting signal', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Delete('remove/:grantId')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Signal remove successfully' })
    async fundedByMe(@Req() req, @Res() res, @Param('grantId') grantId) {
        try {
            let response = await this.signalService.remove(req.user._id, grantId);
            return res.status(httpStatus.OK).json(new APIResponse({}, 'Signal remove successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error removing signal', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

}