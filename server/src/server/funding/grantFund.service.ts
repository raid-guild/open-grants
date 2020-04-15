import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GrantFund } from './grantFund.model';

@Injectable()
export class GrantFundService {
    constructor(@InjectModel('GrantFund') private readonly GrantFundModel: Model<GrantFund>) { }

    async add(data: any): Promise<GrantFund> {
        const temp = new this.GrantFundModel(data);
        let response = await temp.save();
        return response;
    }

    async getAll(): Promise<GrantFund[]> {
        const response = await this.GrantFundModel.find({ isActive: true })
            .populate('grant')
            .populate('donor')
            .exec();
        return response;
    }

    async getById(id: string): Promise<GrantFund> {
        const response = await this.GrantFundModel.findOne({ _id: id, isActive: true })
            .populate('grant')
            .populate('donor')
            .exec();
        return response;
    }

    async getByDonor(donorId: string): Promise<GrantFund[]> {
        return await this.GrantFundModel.find({
            donor: donorId,
            isActive: true
        })
            .populate({
                path: 'grant',
                populate: [{
                    path: 'grantManager',
                    model: 'User'
                }, {
                    path: 'grantees',
                    model: 'User'
                }, {
                    path: 'createdBy',
                    model: 'User'
                }]
            })
            .populate('donor')
            .exec();
    }

    async getBydate(grantId: any, from: any, to: any): Promise<GrantFund[]> {
        const response = await this.GrantFundModel.find({
            grant: grantId,
            createdAt: { $gte: from, $lte: to },
            isActive: true
        })
            .exec();
        return response;
    }
    async getByDonorAndGrant(grantId: string, donorId: string): Promise<GrantFund> {
        return await this.GrantFundModel.findOne({
            grant: grantId,
            donor: donorId,
            isActive: true
        }).exec();
    }

    async update(data: GrantFund): Promise<GrantFund> {
        const response = await this.GrantFundModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }

    async delete(id): Promise<any> {
        const response = await this.GrantFundModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return response;
    }

}