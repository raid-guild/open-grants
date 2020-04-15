import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Signal } from './signal.model';

@Injectable()
export class SignalService {
    constructor(@InjectModel('Signal') private readonly SignalModel: Model<Signal>) { }

    async signal(data: Signal): Promise<Signal> {
        const signal = new this.SignalModel(data);
        let response = await signal.save();
        return response;
    }

    async getAll(): Promise<Signal[]> {
        const response = await this.SignalModel.find({ isActive: true })
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async getById(id: string): Promise<any> {
        const response = await this.SignalModel.findOne({
            _id: id,
            isActive: true
        })
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async getByGrant(grantId: string): Promise<any> {
        const response = await this.SignalModel.find({
            grant: grantId,
            isActive: true
        })
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async getUserAndGrant(userId: string, grantId: string): Promise<any> {
        const response = await this.SignalModel.findOne({
            user: userId,
            grant: grantId,
            isActive: true
        }).exec();
        return response;
    }

    async getByUserAndGrant(userId: string, grantId: string): Promise<any> {
        const response = await this.SignalModel.findOne({
            user: userId,
            grant: grantId,
            isActive: true
        })
            .populate('user')
            .populate('grant')
            .exec();
        return response;
    }

    async update(data: Signal): Promise<Signal> {
        const response = await this.SignalModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }

    async remove(userId: string, grantId: string): Promise<any> {
        const response = await this.SignalModel.findOneAndUpdate(
            {
                user: userId,
                grant: grantId,
                isActive: true
            },
            {
                $set: { isActive: false }
            },
            { new: true });
        return response;
    }
}