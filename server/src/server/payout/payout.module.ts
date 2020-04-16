import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller'
import { GrantService } from '../grant/grant.service';
import { GrantSchema } from '../grant/grant.model';
import { PayoutSchema } from './payout.model';
import { ScheduleService } from '../../helpers/schedule.service';
import { GrantFundTaskService } from '../funding/grantFundTask.service';
import { GrantFundSchema } from '../funding/grantFund.model';
import { GrantFundTaskSchema } from '../funding/grantFundTask.model';
import { CancelRequestSchema } from '../cancelRequest/cancelRequest.model';
import { GrantFundService } from '../funding/grantFund.service';
import { CancelRequestService } from '../cancelRequest/cancelRequest.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Payout', schema: PayoutSchema }]),
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFund', schema: GrantFundSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFundTask', schema: GrantFundTaskSchema }]),
    MongooseModule.forFeature([{ name: 'CancelRequest', schema: CancelRequestSchema }])
  ],
  controllers: [PayoutController],
  providers: [
    PayoutService,
    GrantService,
    GrantFundService,
    GrantFundTaskService,
    CancelRequestService,
    ScheduleService
  ]
})
export class PayoutModule { }