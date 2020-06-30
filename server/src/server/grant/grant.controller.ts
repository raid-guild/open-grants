import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { APIResponse } from '../../helpers/APIResponse';
import { Guard } from '../guard/guard';
import httpStatus = require('http-status');
import { GrantService } from './grant.service';
import { Grant, grantswagger, grantUpdateswagger } from './grant.model';
import {
    ApiResponse,
    ApiParam,
    ApiHeader,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiTags

} from '@nestjs/swagger';
import { GrantFundService } from '../funding/grantFund.service';
import * as moment from 'moment';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from '../../helpers/imageUpload.Service';
import { ScheduleService } from '../../helpers/schedule.service';
var multer = require("multer");


@ApiTags('Grant')
@Controller('api/v1/grant')
@UseGuards(Guard)
export class GrantController {

    typeEnum = {
        SINGLE: "singleDeliveryDate",
        MULTIPLE: "multipleMilestones"
    }

    constructor(private grantService: GrantService,
        private grantFundService: GrantFundService,
        public imageUploadService: ImageUploadService,
        private scheduleService: ScheduleService
    ) { }

    @Post('')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Grant added successfully.' })
    async add(@Req() req, @Res() res, @Body() grantModel: Grant, @Body() grantswagger: grantswagger) {
        try {
            grantModel.createdBy = req.user.publicAddress;
            let response = await this.grantService.add(grantModel);
            this.scheduleService.addJobForGrant(response._id, response.hash);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Grant added successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding grant', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Retrieve user list
    @Get()
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Grants fetched successfully' })
    async getAll(@Req() req, @Res() res) {
        try {
            let response = await this.grantService.getAll();
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Grants fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Getting grants', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // Fetch a particular user using id
    @Get('get/:id')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 200, description: 'Grant fetched successfully' })
    async getById(@Res() res, @Param('id') grantId) {
        try {
            let response = await this.grantService.getById(grantId);

            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Grant fetched successfully', httpStatus.OK));
            } else {
                return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
            }
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting grant', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('getByContract/:contract')
    @ApiBearerAuth()
    @ApiParam({ name: 'contract', type: String })
    @ApiResponse({ status: 200, description: 'Grants fetched successfully' })
    async getByContract(@Req() req, @Res() res, @Param('contract') contract) {
        try {
            let response = await this.grantService.getByContract(contract);
            if (response) {
                return res.status(httpStatus.OK).json(new APIResponse(response, 'Grants fetched successfully', httpStatus.OK));
            }
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting grant', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('createdByMe')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Grants fetched successfully' })
    async createdByMe(@Req() req, @Res() res) {
        try {
            console.log("id", req.user);
            let response = await this.grantService.findCreatedByMe(req.user.publicAddress);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Grants fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting grant', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    @Get('fundedByMe')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Grants fetched successfully' })
    async fundedByMe(@Req() req, @Res() res) {
        try {
            let response = await this.grantService.findFundedByMe(req.user.publicAddress);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Grants fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting grant', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }


    @Get('managedByMe')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Grants fetched successfully' })
    async managedByMe(@Req() req, @Res() res) {
        try {
            // console.log("id", id);
            let response = await this.grantService.managedByMe(req.user.publicAddress);
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Grants fetched successfully', httpStatus.OK));
        } catch (e) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting grant', httpStatus.INTERNAL_SERVER_ERROR, e));
        }
    }

    // @Get('trendingGrants')
    // async getTrendingGrants(@Res() res) {
    //     try {
            let allGrant = await this.grantService.getAll();

allGrant = allGrant.sort(function (obj1, obj2) {
    if ((obj1.totalFunding + obj1.totalPayed) == 0) {
        return ((obj2.totalFunding + obj2.totalPayed) / obj2.targetFunding * 100) - 0;
    }

    if ((obj2.totalFunding + obj2.totalPayed) == 0) {
        return 0 - ((obj1.totalFunding + obj1.totalPayed) / obj1.targetFunding * 100);
    }

    return ((obj2.totalFunding + obj2.totalPayed) / obj2.targetFunding * 100) - ((obj1.totalFunding + obj1.totalPayed) / obj1.targetFunding * 100);
});

//         return res.status(httpStatus.OK).json(new APIResponse(allGrant, 'Grants fetched successfully', httpStatus.OK));
//     } catch (e) {
//         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error Getting grant', httpStatus.INTERNAL_SERVER_ERROR, e));
//     }
// }

@Put('')
@ApiBearerAuth()
@ApiResponse({ status: 200, description: 'Grants updated successfully' })
async update(@Res() res, @Body() grantModel: Grant, @Body() grantUpdateswagger: grantUpdateswagger) {
    try {
        let response = await this.grantService.update(grantModel);
        if (response) {
            return res.status(httpStatus.OK).json(new APIResponse(response, 'Grants updated succesfully', httpStatus.OK));
        } else {
            return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'No Record Found', httpStatus.BAD_REQUEST));
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error updating grant', httpStatus.INTERNAL_SERVER_ERROR, e));
    }
}

@Post('cancel/:id')
@ApiBearerAuth()
@ApiResponse({ status: 200, description: 'Grant cancel successfully' })
async cancel(@Req() req, @Res() res, @Body() body) {
    try {
        this.scheduleService.addJobForCancelGrant(body.grant, body.hash);
        return res.status(httpStatus.OK).json(new APIResponse(null, 'Grant cancel successfully', httpStatus.OK));
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse(null, 'Error cancling grant', httpStatus.INTERNAL_SERVER_ERROR, e));
    }
}

@Post('/uploadedFile')
@UseInterceptors(
    FileInterceptor('file', {
        storage: multer.diskStorage({
            destination: 'files/',
            filename: (req, file, cb) => {
                const extension = file.originalname.split('.');
                const filename = `${Date.now()}.${extension[extension.length - 1]}`;
                return cb(null, filename)
            }
        })
    })
)
async uploadedFile(@Res() res, @UploadedFile() file) {
    try {
        let imagePath = await this.imageUploadService.uploadImage(file);

        return res.status(httpStatus.OK).json(new APIResponse({ url: imagePath }, 'File upload successfully', httpStatus.OK));
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error adding user', httpStatus.INTERNAL_SERVER_ERROR, e));
    }
}

}