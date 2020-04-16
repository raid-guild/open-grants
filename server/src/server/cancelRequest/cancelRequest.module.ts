import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantService } from '../grant/grant.service';
import { GrantSchema } from '../grant/grant.model';
import { CancelRequestSchema } from './cancelRequest.model';
import { CancelRequestController } from './cancelRequest.controller';
import { CancelRequestService } from './cancelRequest.service';
import { ScheduleService } from '../../helpers/schedule.service';
import { GrantFundTaskService } from '../funding/grantFundTask.service';
import { GrantFundTaskSchema } from '../funding/grantFundTask.model';
import { GrantFundService } from '../funding/grantFund.service';
import { GrantFundSchema } from '../funding/grantFund.model';
import { PayoutService } from '../payout/payout.service';
import { PayoutSchema } from '../payout/payout.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CancelRequest', schema: CancelRequestSchema }]),
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFundTask', schema: GrantFundTaskSchema }]),
    MongooseModule.forFeature([{ name: 'Payout', schema: PayoutSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFund', schema: GrantFundSchema }]),
  ],
  controllers: [CancelRequestController],
  providers: [
    CancelRequestService,
    GrantService,
    GrantFundService,
    GrantFundTaskService,
    PayoutService,
    ScheduleService
  ]
})
export class CancelRequestModule { }