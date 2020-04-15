import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import { Guard } from '../guard/guard';
import httpStatus = require('http-status');
import { GrantFundService } from './grantFund.service';
import { GrantFund, grantswagger } from './grantFund.model';
import { GrantService } from '../grant/grant.service';
import { GrantFundTaskService } from './grantFundTask.service';
import { GrantFundTask } from './grantFundTask.model';
import {
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiTags
} from '@nestjs/swagger';
import { ScheduleService } from '../../helpers/schedule.service';

@ApiTags('GrantFund')
@Controller('api/v1/grantFund')
@UseGuards(Guard)
export class GrantFundController {
    constructor(private grantFundService: GrantFundService,
        private grantFundTaskService: GrantFundTaskService,
        private grantService: GrantService,
        private scheduleService: ScheduleService
    ) { }

    statusEnum = {
        ACTIVE: "active",
        WITHDRAW: "withdraw",
        REFUND: "refund",
        CANCEL: "cancel"
    }

    @Post('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Fund added successfully.' })
    async add(@Req() req, @Res() res, @Body() GrantFundTaskModel: GrantFundTask) {
        try {
            GrantFundTaskModel.donor = req.user._id;
            let response = await this.grantFundTaskService.add(GrantFundTaskModel);
            this.scheduleService.addJobForFund(response._id, response.hash);
            return res.status(httpStatus.OK).json(new APIResponse({}, 'Fund added successfully', httpStatus.OK));

            // let grantData = await this.grantService.getForFunding(GrantFundTaskModel.grant, GrantFundTaskModel.donor);
            // if (grantData) {
            //     if (grantData.canFund) {
            //         if (GrantFundTaskModel.amount > (grantData.targetFunding - grantData.totalFunding)) {
            //             grantData.canFund = false;
            //             GrantFundTaskModel.amount = grantData.targetFunding - grantData.totalFunding;
            //         }

            //         let grantFund = await this.grantFundService.getByDonorAndGrant(GrantFundTaskModel.grant, GrantFundTaskModel.donor);
            //         if (grantFund) {

            //             grantFund.fundingAmount += +GrantFundTaskModel.amount;
            //             grantData.totalFunding += +GrantFundTaskModel.amount;

            //             if (grantData.totalFunding == grantData.targetFunding) {
            //                 grantData.canFund = false;
            //             }

            //             let promise = [];
            //             promise.push(this.grantFundTaskService.add(GrantFundTaskModel));
            //             promise.push(this.grantFundService.update(grantFund));
            //             promise.push(this.grantService.update(grantData));

            //             let response = await Promise.all(promise);

            //             return res.status(httpStatus.OK).json(new APIResponse(response[1], 'Fund added successfully', httpStatus.OK));
            //         } else {
            //             let grantFundModele = [];
            //             grantFundModele["grant"] = GrantFundTaskModel.grant;
            //             grantFundModele['donor'] = GrantFundTaskModel.donor;
            //             grantFundModele["fundingAmount"] = GrantFundTaskModel.amount;

            //             grantData.totalFunding += +GrantFundTaskModel.amount;
            //             grantData.donors.push(GrantFundTaskModel.donor);

            //             if (grantData.totalFunding == grantData.targetFunding) {
            //                 grantData.canFund = false;
            //             }

            //             let promise = [];
            //             promise.push(this.grantFundTaskService.add(GrantFundTaskModel));
            //             promise.push(this.grantFundService.add(grantFundModele));
            //             promise.push(this.grantService.update(grantData));

            //             let response = await Promise.all(promise);

            //             return res.status(httpStatus.OK).json(new APIResponse(response[1], 'Fund added successfully', httpStatus.OK));
            //         }
            //     }
            //     return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Grant not open to funding', httpStatus.BAD_REQUEST));
            // }
            // return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'You can not funding on this grant', httpStatus.BAD_REQUEST));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error funding grant', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Withdraw Grant
    @Post('withdraw')
    async withdraw(@Req() req, @Res() res, @Body() body: GrantFundTask) {
        body.donor = req.user._id;
        let grantFund = await this.grantFundService.getByDonorAndGrant(body.grant, body.donor);
        console.log("body", grantFund);
        if (grantFund && grantFund.fundingAmount >= body.amount) {

            let grantData = await this.grantService.getById(body.grant);

            body.status = this.statusEnum.WITHDRAW;
            grantFund.fundingAmount -= +body.amount;
            grantData.fund -= +body.amount;

            let promise = [];
            promise.push(this.grantFundTaskService.add(body));
            promise.push(this.grantFundService.update(grantFund));
            promise.push(this.grantService.update(grantData));

            let response = await Promise.all(promise);

            return res.status(httpStatus.OK).json(new APIResponse(response[1], 'Withdraw successfully', httpStatus.OK));
        } else {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Amount not valide', httpStatus.BAD_REQUEST));
        }
    }

    // Retrieve user list
    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Records fetched successfully.' })
    async getAll(@Res() res) {
        try {
            let response = await this.grantFundService.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Getting Records', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Fetch a particular user using id
    @Get('get/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Records fetched successfully.' })
    async getById(@Res() res, @Param('id') id) {
        try {
            let response = await this.grantFundService.getById(id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('fundedByMe')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'funded By me.' })
    async fundedByMe(@Req() req, @Res() res) {
        try {
            // console.log("id", id);
            let response = await this.grantFundService.getByDonor(req.user._id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('fundingTaskByGrantAndUser/:id')
    async myFundingTask(@Res() res, @Req() req, @Param('id') grantId) {
        try {
            let response = await this.grantFundTaskService.getByDonorAndGrant(grantId, req.user._id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Records fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Update a user's details
    @Put('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'fund updated succesfully.' })
    async update(@Res() res, @Body() GrantFundModel: GrantFund, @Body() grantswagger: grantswagger) {
        try {
            let response = await this.grantFundService.update(GrantFundModel);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Records updated succesfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error updating Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Delete a user
    @Delete(':id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'fund deleted successfully.' })
    async delete(@Res() res, @Param('id') id) {
        try {
            let response = await this.grantFundService.delete(id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(null, 'Record deleted successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error deleting  Record', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }
}