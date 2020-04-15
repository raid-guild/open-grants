import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantFundSchema } from './grantFund.model';
import { GrantFundService } from './grantFund.service';
import { GrantFundController } from './grantFund.controller';
import { GrantService } from '../grant/grant.service';
import { GrantSchema } from '../grant/grant.model';
import { GrantFundTaskSchema } from './grantFundTask.model';
import { GrantFundTaskService } from './grantFundTask.service';
import { ScheduleService } from '../../helpers/schedule.service';
import { CancelRequestSchema } from '../cancelRequest/cancelRequest.model';
import { CancelRequestService } from '../cancelRequest/cancelRequest.service';
import { PayoutSchema } from '../payout/Payout.model';
import { PayoutService } from '../payout/payout.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'GrantFund', schema: GrantFundSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFundTask', schema: GrantFundTaskSchema }]),
    MongooseModule.forFeature([{ name: 'CancelRequest', schema: CancelRequestSchema }]),
    MongooseModule.forFeature([{ name: 'Payout', schema: PayoutSchema }]),
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }])
  ],
  controllers: [GrantFundController],
  providers: [
    GrantFundService,
    GrantFundTaskService,
    GrantService,
    CancelRequestService,
    PayoutService,
    ScheduleService
  ]
})
export class GrantFundModule { }