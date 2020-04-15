import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import { Guard } from '../guard/guard';
import httpStatus = require('http-status');
import { PayoutService } from './payout.service';
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
import { Payout } from './Payout.model';
import { response } from 'express';
import { ScheduleService } from '../../helpers/schedule.service';

export interface approveBody {
    requestId: string,
    hash: string
}

export interface rejectBody {
    requestId: string
}

@ApiTags('Payout')
@Controller('api/v1/payout')
@UseGuards(Guard)
export class PayoutController {

    constructor(
        private payoutService: PayoutService,
        private grantService: GrantService,
        private scheduleService: ScheduleService
    ) { }

    @Post('request')
    async request(@Req() req, @Res() res, @Body() payoutModel: Payout) {
        try {
            payoutModel.grantee = req.user._id;

            let response = await this.grantService.getById(payoutModel.grant);
            response = JSON.parse(JSON.stringify(response));
            if (response) {
                if (response.status == "confirmed" && response.isActive && !response.isCancel) {
                    if (!response.canFund) {
                        // if (payoutModel.requestAmount <= (response.totalFunding - response.totalPayed)) {
                        let granteeData;
                        response.grantees.map((data, index) => {
                            if (data.grantee._id == payoutModel.grantee) {
                                granteeData = data;
                            }
                        })

                        if (granteeData && (granteeData.allocationAmount - granteeData.payedAmount) >= payoutModel.requestAmount) {
                            payoutModel.grantManager = response.grantManager._id;
                            response = await this.payoutService.request(payoutModel);
                            return res.status(httpStatus.OK).json(new APIResponse(response, 'Request sent successfully', httpStatus.OK));
                        }
                        return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Request amount is grater then remaining allocation', httpStatus.BAD_REQUEST));
                        // }
                        // return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Request amount is grater then available fund', httpStatus.BAD_REQUEST));
                    }
                    return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Funding target not met', httpStatus.BAD_REQUEST));
                }
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Grant was cancelled', httpStatus.BAD_REQUEST));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Grant not found', httpStatus.BAD_REQUEST));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error sending request', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Post('approve')
    async approve(@Req() req, @Res() res, @Body() body: approveBody) {
        try {
            console.log("body", body);
            let response = await this.payoutService.approveRequest(body.requestId, body.hash);
            this.scheduleService.addJobForPayout(response._id, response.hash);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Request approved successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error approveing request', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Post('rejecte')
    async rejecte(@Req() req, @Res() res, @Body() body: rejectBody) {
        try {
            let request = await this.payoutService.getByManagerAndRequest(body.requestId, req.user._id);
            request = JSON.parse(JSON.stringify(request));
            if (request) {
                if (request.requestStatus == "pending") {
                    request = await this.payoutService.rejectRequest(body.requestId);
                    return res.status(httpStatus.OK).json(new APIResponse(request, 'Request rejected successfully', httpStatus.OK));
                }
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Request already ' + request.status, httpStatus.BAD_REQUEST));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'Onyl manager can reject request', httpStatus.BAD_REQUEST));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error rejecting request', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Retrieve list
    @Get('request')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Payout requests fetched successfully' })
    async getAll(@Req() req, @Res() res) {
        try {
            let response = await this.payoutService.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Payout requests fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Getting payout requests', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('request/getByGrantee')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Payout requests fetched successfully' })
    async getByUser(@Req() req, @Res() res) {
        try {
            let response = await this.payoutService.getByUser(req.user._id);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Payout requests fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting payout requests', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('request/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Payout request fetched successfully' })
    async getById(@Res() res, @Param('id') requestId) {
        try {
            let response = await this.payoutService.getById(requestId);

            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Payout request fetched successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting payout request', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('request/getByGrant/:id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Payout requests fetched successfully' })
    async getByGrant(@Req() req, @Res() res, @Param('id') grantId) {
        try {
            let response = await this.payoutService.getByGrant(grantId);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Payout requests fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting payout requests', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('request/getByUserAndGrant/:id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Payout requests fetched successfully' })
    async getByUserAndGrant(@Req() req, @Res() res, @Param('id') grantId) {
        try {
            let response = await this.payoutService.getByGranteeAndGrant(req.user._id, grantId);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Payout requests fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error getting payout requests', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Put('')
    async update(@Res() res, @Body() payoutModel: Payout) {
        try {
            let response = await this.payoutService.update(payoutModel);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Payout request updated succesfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error updating grant', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Delete(':Id')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Payout request deleted successfully' })
    async fundedByMe(@Req() req, @Res() res, @Param('Id') Id) {
        try {
            let response = await this.payoutService.delete(Id);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse({}, 'Payout request deleted successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error deleting Payout request', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

}