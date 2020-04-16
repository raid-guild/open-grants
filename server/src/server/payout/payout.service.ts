import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Payout } from './payout.model';
import { GrantService } from '../grant/grant.service';

@Injectable()
export class PayoutService {
    constructor(
        @InjectModel('Payout') private readonly PayoutModel: Model<Payout>,
        private grantService: GrantService
    ) { }

    async request(data: Payout): Promise<Payout> {
        const payout = new this.PayoutModel(data);
        let response = await payout.save();
        return response;
    }

    async getAll(): Promise<Payout[]> {
        const response = await this.PayoutModel.find()
            .populate('grantManager')
            .populate('grantee')
            .populate('grant')
            .exec();
        return response;
    }

    async getById(id: string): Promise<any> {
        const response = await this.PayoutModel.findOne({
            _id: id
        })
            .populate('grantManager')
            .populate('grantee')
            .populate('grant')
            .exec();
        return response;
    }

    async getByGrant(grantId: string): Promise<any> {
        const response = await this.PayoutModel.find({
            grant: grantId
        })
            .populate('grantManager')
            .populate('grantee')
            .populate('grant')
            .exec();
        return response;
    }

    async getByUser(userId: string): Promise<any> {
        const response = await this.PayoutModel.find({
            grantee: userId
        })
            // .populate('grantManager')
            // .populate('grantee')
            // .populate('grant')
            .exec();
        return response;
    }

    async getByGranteeAndGrant(userId: string, grantId: string): Promise<any> {
        const response = await this.PayoutModel.find({
            grantee: userId,
            grant: grantId
        })
            .populate('grantManager')
            .populate('grantee')
            .populate('grant')
            .exec();
        return response;
    }

    async getByManagerAndRequest(requestId: string, managerId: string): Promise<any> {
        const response = await this.PayoutModel.findOne({
            _id: requestId,
            grantManager: managerId
        }).exec();
        return response;
    }

    async getByStatus(status: string): Promise<Payout[]> {
        const response = await this.PayoutModel.find({
            status: status,
            requestStatus: "approved",
        }).exec();
        return response;
    }

    async approveRequest(id: string, hash: string): Promise<Payout> {
        const response = await this.PayoutModel.findByIdAndUpdate(id, { requestStatus: "approved", status: "pending", hash: hash }, { new: true });
        return response;
    }

    async rejectRequest(id: string): Promise<Payout> {
        const response = await this.PayoutModel.findByIdAndUpdate(id, { requestStatus: "rejected" }, { new: true });
        return response;
    }

    async update(data: any): Promise<Payout> {
        const response = await this.PayoutModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }

    async delete(id: string): Promise<Payout> {
        const response = await this.PayoutModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return response;
    }

    async confirmApprove(requestId, status) {
        try {
            let response = await this.update({ _id: requestId, status: status });
            if (status == "confirmed") {
                let grant = await this.grantService.getById(response.grant);
                grant = JSON.parse(JSON.stringify(grant));

                let granteeIndex;
                grant.grantees.map((data, index) => {
                    if (data.grantee._id == response.grantee) {
                        granteeIndex = index;
                    }
                })

                grant.totalPayed += response.requestAmount;
                grant.grantees[granteeIndex].payedAmount += response.requestAmount
                await this.grantService.update(grant);
            }
        } catch (e) {
            console.log("erroe", e)
        }
    }
}