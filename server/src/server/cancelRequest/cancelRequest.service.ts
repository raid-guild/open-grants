import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CancelRequest } from './cancelRequest.model'
import { GrantService } from '../grant/grant.service';

@Injectable()
export class CancelRequestService {
    constructor(
        @InjectModel('CancelRequest') private readonly CancelRequestModel: Model<CancelRequest>,
        private grantService: GrantService
    ) { }

    async request(data: CancelRequest): Promise<CancelRequest> {
        const payout = new this.CancelRequestModel(data);
        let response = await payout.save();
        return response;
    }

    async getAll(): Promise<CancelRequest[]> {
        const response = await this.CancelRequestModel.find()
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async getById(id: string): Promise<any> {
        const response = await this.CancelRequestModel.findOne({
            _id: id
        })
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async getByGrant(grantId: string): Promise<any> {
        const response = await this.CancelRequestModel.find({
            grant: grantId
        })
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async getByUser(userId: string): Promise<any> {
        const response = await this.CancelRequestModel.find({
            user: userId
        })
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async getByUserAndGrant(userId: string, grantId: string): Promise<any> {
        const response = await this.CancelRequestModel.find({
            grant: grantId,
            user: userId
        })
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async getByStatus(status: string): Promise<CancelRequest[]> {
        const response = await this.CancelRequestModel.find({
            status: status
        }).exec();
        return response;
    }

    async update(data: any): Promise<CancelRequest> {
        const response = await this.CancelRequestModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }


    async confirmCancel(requestId, status) {
        try {
            let response = await this.update({ _id: requestId, status: status });
            console.log("response");
            if (status == "confirmed") {
                await this.grantService.cancel(response.grant, response.user);
            }
        } catch (e) {
            console.log("erroe", e)
        }
    }
}