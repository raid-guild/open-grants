import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GrantFundTask } from './grantFundTask.model';
import { GrantFundService } from './grantFund.service';
import { GrantService } from '../grant/grant.service';

@Injectable()
export class GrantFundTaskService {
    constructor(
        @InjectModel('GrantFundTask') private readonly GrantFundTaskModel: Model<GrantFundTask>,
        private grantFundService: GrantFundService,
        private grantService: GrantService,
    ) { }

    async add(data: GrantFundTask): Promise<GrantFundTask> {
        const temp = new this.GrantFundTaskModel(data);
        let response = await temp.save();
        return response;
    }

    async getAll(): Promise<GrantFundTask[]> {
        return await this.GrantFundTaskModel.find({ isActive: true }).exec();
    }

    async getById(id: string): Promise<GrantFundTask> {
        return await this.GrantFundTaskModel.findOne({ _id: id, isActive: true }).exec();
    }

    async getByDonorAndGrant(grantId: string, donorId: string): Promise<GrantFundTask[]> {
        return await this.GrantFundTaskModel.find({
            donor: donorId,
            grant: grantId,
            isActive: true
        }).exec();
    }

    async getByDonor(donorId: string): Promise<GrantFundTask[]> {
        return await this.GrantFundTaskModel.find({ donor: donorId, isActive: true }).exec();
    }

    async getByStatus(status: string): Promise<GrantFundTask[]> {
        return await this.GrantFundTaskModel.find({ status: status }).exec();
    }

    async update(data: GrantFundTask): Promise<GrantFundTask> {
        return await this.GrantFundTaskModel.findByIdAndUpdate(data._id, data, { new: true });
    }

    async delete(id): Promise<any> {
        return await this.GrantFundTaskModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    async confirmeFunding(fundId, status) {
        try {
            console.log("fundId, status", fundId, status);
            let GrantFundTaskModel = await this.getById(fundId);
            GrantFundTaskModel.status = status;
            if (status == "failed") {
                await GrantFundTaskModel.save();
                return
            } else if (status == "confirmed") {

                let grantData = await this.grantService.getForFunding(GrantFundTaskModel.grant, GrantFundTaskModel.donor);
                if (grantData) {

                    if (GrantFundTaskModel.amount > (grantData.targetFunding - grantData.totalFunding)) {
                        grantData.canFund = false;
                        GrantFundTaskModel.amount = grantData.targetFunding - grantData.totalFunding;
                    }

                    let grantFund = await this.grantFundService.getByDonorAndGrant(GrantFundTaskModel.grant, GrantFundTaskModel.donor);
                    if (grantFund) {
                        grantFund.fundingAmount += +GrantFundTaskModel.amount;
                        grantData.totalFunding += +GrantFundTaskModel.amount;

                        if (grantData.totalFunding == grantData.targetFunding) {
                            grantData.canFund = false;
                        }

                        let promise = [];
                        promise.push(GrantFundTaskModel.save());
                        promise.push(this.grantFundService.update(grantFund));
                        promise.push(this.grantService.update(grantData));
                        await Promise.all(promise);

                        return;
                    } else {
                        let grantFundModele = [];
                        grantFundModele["grant"] = GrantFundTaskModel.grant;
                        grantFundModele['donor'] = GrantFundTaskModel.donor;
                        grantFundModele["fundingAmount"] = GrantFundTaskModel.amount;

                        grantData.totalFunding += +GrantFundTaskModel.amount;
                        grantData.donors.push(GrantFundTaskModel.donor);

                        if (grantData.totalFunding == grantData.targetFunding) {
                            grantData.canFund = false;
                        }

                        let promise = [];
                        promise.push(GrantFundTaskModel.save());
                        promise.push(this.grantFundService.add(grantFundModele));
                        promise.push(this.grantService.update(grantData));
                        await Promise.all(promise);

                        return
                    }
                }
            }

            console.log("return")
            return
        } catch (e) {
            console.log("e", e);
            return
        }
    }

}