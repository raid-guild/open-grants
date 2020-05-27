import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly UserModel: Model<User>) { }

    async login(data: { userName: any; password: any; }): Promise<any> {
        return await this.UserModel.findOne({
            $or: [{ userName: data.userName }, { email: data.userName }],
            password: data.password,
            isActive: true
        }).exec();
    }

    async getByPublicAddress(publicAddress: string): Promise<any> {
        const response = await this.UserModel.findOne({
            publicAddress: publicAddress
        }).exec();
        return response;
    }

    async add(data: User): Promise<User> {
        const user = new this.UserModel(data);
        let response = await user.save();
        return response;
    }
}