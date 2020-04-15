import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import { Guard } from '../guard/guard';
import httpStatus = require('http-status');
import { GrantService } from '../grant/grant.service';

import {
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiTags

} from '@nestjs/swagger';
import { CancelRequestService } from './cancelRequest.service';
import { CancelRequest } from './cancelRequest.model';
import { ScheduleService } from '../../helpers/schedule.service';

@ApiTags('CancelRequest')
@Controller('api/v1/cancelRequest')
@UseGuards(Guard)
export class CancelRequestController {

    constructor(
        private cancelRequestService: CancelRequestService,
        private scheduleService: ScheduleService
    ) { }

    @Post('')
    async request(@Req() req, @Res() res, @Body() cancelRequestModel: CancelRequest) {
        try {
            cancelRequestModel.user = req.user._id;
            let response = await this.cancelRequestService.request(cancelRequestModel);
            this.scheduleService.addJobForCancelGrant(response._id, response.hash);
            return res.status(httpStatus.OK).json(new APIResponse(null, 'Grant cancel successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error sending request', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Retrieve list
    @Get('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Cancel requests fetched successfully' })
    async getAll(@Req() req, @Res() res) {
        try {
            let response = await this.cancelRequestService.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Cancel requests fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Getting cancel requests', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('getByUser')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Cancel requests fetched successfully' })
    async getByUser(@Req() req, @Res() res) {
        try {
            let response = await this.cancelRequestService.getByUser(req.user._id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Cancel requests fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting cancel requests', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Cancel request fetched successfully' })
    async getById(@Res() res, @Param('id') requestId) {
        try {
            let response = await this.cancelRequestService.getById(requestId);

            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Cancel request fetched successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting cancel request', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('getByGrant/:id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Cancel requests fetched successfully' })
    async getByGrant(@Req() req, @Res() res, @Param('id') grantId) {
        try {
            let response = await this.cancelRequestService.getByGrant(grantId);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Cancel requests fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting cancel requests', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('getByUserAndGrant/:id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Cancel requests fetched successfully' })
    async getByUserAndGrant(@Req() req, @Res() res, @Param('id') grantId) {
        try {
            let response = await this.cancelRequestService.getByUserAndGrant(req.user._id, grantId);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Cancel requests fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting cancel requests', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}