import { Injectable, flatten } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly UserModel: Model<User>) { }

    // fetch all User
    async getAll(): Promise<User[]> {
        const response = await this.UserModel.find({ isActive: true }).exec();
        return response;
    }

    // Get a single user
    async getById(id: string): Promise<User> {
        const response = await this.UserModel.findOne({ _id: id, isActive: true }).exec();
        return response;
    }

    async searchByUser(name: string): Promise<User[]> {
        const response = await this.UserModel.find({
            "$or": [
                { "firstName": { '$regex': name } },
                { "lastName": { '$regex': name } },
                { "userName": { '$regex': name } }
            ]
        }).exec();
        return response;
    }

    async searchBypublicAddress(publicAddress: string): Promise<User> {
        const response = await this.UserModel.findOne({
            publicAddress: publicAddress
        }).exec();
        return response;
    }

    // Edit user details
    async update(data: User): Promise<User> {
        const response = await this.UserModel.findByIdAndUpdate(data._id, data, { new: true });
        return response;
    }

    // change password
    async changePassword(data: any): Promise<any> {
        const response = await this.UserModel.findOneAndUpdate(
            { _id: data._id, password: data.oldPassword },
            { password: data.newPassword },
            { new: true });
        return response;
    }

    // Delete a user
    async delete(id): Promise<any> {
        const response = await this.UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return response;
    }

    async uploadProfile(id: string, filePath: any): Promise<any> {
        const response = await this.UserModel.findByIdAndUpdate(id, { picture: filePath }, { new: true });
        return response;
    }
    // async delete(id): Promise<any> {
    //     const response = await this.UserModel.findByIdAndRemove(id);
    //     return response;
    // }
}