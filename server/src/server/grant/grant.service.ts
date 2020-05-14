import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Grant } from './grant.model';

@Injectable()
export class GrantService {
    constructor(@InjectModel('Grant') private readonly GrantModel: Model<Grant>) { }

    async add(data: Grant): Promise<Grant> {
        const grant = new this.GrantModel(data);
        let response = await grant.save();
        return response;
    }

    async getAll(): Promise<Grant[]> {
        const response = await this.GrantModel.find({})
            .sort({ createdAt: -1 })
            .exec();
        return response;
    }

    async getById(id: string): Promise<any> {
        const response = await this.GrantModel.findOne({ _id: id })
            .exec();
        return response;
    }

    async getByContract(contract: string): Promise<any> {
        const response = await this.GrantModel.findOne({ contractId: contract })
            .exec();
        return response;
    }

    async getForFunding(grantId: string, donor: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: grantId,
            grantManager: { $ne: donor },
            grantees: { $elemMatch: { grantee: { $ne: donor } } }
        })
            .exec();
        return response;
    }

    async getByIdAndManager(grant: string, user: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: grant,
            grantManager: user
        }).exec();
        return response;
    }

    async getByIdAndDonorAndGrantee(grant: string, user: string): Promise<any> {
        const response = await this.GrantModel.findOne({
            _id: grant,
            $or: [{
                grantees: { $elemMatch: { grantee: user } }
            }, {
                donors: { $in: [user] }
            }]
        })
            .exec();
        return response;
    }

    async findCreatedByMe(id: string): Promise<any> {
        const response = await this.GrantModel.find({ createdBy: id })
            .exec();
        return response;
    }

    async findFundedByMe(id: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({ donors: { $in: [id] } })
            .exec();
        return response;
    }

    async managedByMe(id: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({ grantManager: id })
            .exec();
        return response;
    }

    async getByManagerAndGrant(grantId: string, managerId: string): Promise<Grant> {
        const response = await this.GrantModel.findOne({
            _id: grantId,
            grantManager: managerId
        }).exec();
        return response;
    }

    async getByStatus(status: string): Promise<Grant[]> {
        const response = await this.GrantModel.find({
            status: status
        }).exec();
        return response;
    }

    async update(data: any): Promise<Grant> {
        const response = await this.GrantModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }

    async cancel(grant: string, user: string): Promise<any> {
        const response = await this.GrantModel.findByIdAndUpdate(
            grant,
            {
                isCancel: true,
                cancelBy: user
            },
            { new: true }
        );
        return response;
    }

    // async delete(id): Promise<any> {
    //     const response = await this.GrantModel.findByIdAndRemove(id);
    //     return response;
    // }
}