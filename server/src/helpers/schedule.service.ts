import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectSchedule, Schedule } from 'nest-schedule';
import { ethers } from 'ethers';
import config = require('../config');
import { GrantService } from '../server/grant/grant.service';
import { GrantFundTaskService } from '../server/funding/grantFundTask.service';
import { CancelRequestService } from '../server/cancelRequest/cancelRequest.service';
import { PayoutService } from '../server/payout/payout.service';

@Injectable()
export class ScheduleService implements OnModuleInit {
    provider = ethers.getDefaultProvider(config.ethers.networks);

    constructor(
        @InjectSchedule() private readonly schedule: Schedule,
        private grantFundTaskService: GrantFundTaskService,
        private cancelRequestService: CancelRequestService,
        private payoutService: PayoutService,
        private grantService: GrantService,
    ) {
    }

    onModuleInit(): any {
        // this.autoJobForGrant();
        // this.autoJobForFund();
        // this.autoJobForCancelGrant();
        // this.autoJobForPayout();
    }

    addJobForGrant(grantId, hash) {
        this.schedule.scheduleCronJob(grantId, config.schedule.cronJob, async () => {
            let transactionReceipt = await this.provider.getTransactionReceipt(hash)
            if (transactionReceipt) {
                let data = {
                    _id: grantId,
                    status: (transactionReceipt.status == 1) ? 'confirmed' : 'failed'
                }
                // console.log("data", data);
                await this.grantService.update(data);
                return true;
            }
            return false;
        });
    }

    autoJobForGrant() {
        this.schedule.scheduleCronJob('grant-job', config.schedule.autoJob, async () => {
            try {
                let grants = await this.grantService.getByStatus("pending");
                grants.map((grant) => {
                    this.addJobForGrant(grant._id, grant.hash)
                });
                return false;
            } catch (e) {
                return false;
            }
        });
    }

    addJobForCancelGrant(requestId, hash) {
        this.schedule.scheduleCronJob(requestId, config.schedule.cronJob, async () => {
            let transactionReceipt = await this.provider.getTransactionReceipt(hash)
            if (transactionReceipt) {
                let status = (transactionReceipt.status == 1) ? 'confirmed' : 'failed';
                console.log("status", status);
                this.cancelRequestService.confirmCancel(requestId, status);
                return true;
            }
            return false;
        });
    }

    autoJobForCancelGrant() {
        this.schedule.scheduleCronJob('cancelGrant-job', config.schedule.autoJob, async () => {
            try {
                let requests = await this.cancelRequestService.getByStatus("pending");
                requests.map((request) => {
                    this.addJobForCancelGrant(request._id, request.hash)
                });
                return false;
            } catch (e) {
                return false;
            }
        });
    }

    addJobForFund(fundId, hash) {
        this.schedule.scheduleCronJob(fundId, config.schedule.cronJob, async () => {
            let transactionReceipt = await this.provider.getTransactionReceipt(hash)
            if (transactionReceipt) {
                let status = (transactionReceipt.status == 1) ? 'confirmed' : 'failed';
                console.log("status", status);
                await this.grantFundTaskService.confirmeFunding(fundId, status);
                return true;
            }
            return false;
        });
    }

    autoJobForFund() {
        this.schedule.scheduleCronJob('fund-job', config.schedule.autoJob, async () => {
            try {
                let tasks = await this.grantFundTaskService.getByStatus("pending");
                tasks.map((task) => {
                    this.addJobForFund(task._id, task.hash)
                });
                return false;
            } catch (e) {
                return false;
            }
        });
    }

    addJobForPayout(requestId, hash) {
        this.schedule.scheduleCronJob(requestId, config.schedule.cronJob, async () => {
            let transactionReceipt = await this.provider.getTransactionReceipt(hash);
            if (transactionReceipt) {
                let status = (transactionReceipt.status == 1) ? 'confirmed' : 'failed';
                await this.payoutService.confirmApprove(requestId, status);
                return true;
            }
            return false;
        });
    }

    autoJobForPayout() {
        this.schedule.scheduleCronJob('payout-job', config.schedule.cronJob, async () => {
            try {
                let requests = await this.payoutService.getByStatus("pending");
                console.log("requests", requests);
                requests.map((request) => {
                    this.addJobForPayout(request._id, request.hash);
                });
                return false;
            } catch (e) {
                return false;
            }
        });
    }

    cancelJob() {
        this.schedule.cancelJob('my-job');
    }
}