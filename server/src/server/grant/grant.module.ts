import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantSchema } from './grant.model';
import { GrantService } from './grant.service';
import { GrantController } from './grant.controller';
import { GrantFundService } from '../funding/grantFund.service';
import { GrantFundSchema } from '../funding/grantFund.model';
import { GrantFundTaskSchema } from '../funding/grantFundTask.model';
import { ImageUploadService } from '../../helpers/imageUpload.Service';
import { ScheduleService } from '../../helpers/schedule.service';
import { GrantFundTaskService } from '../funding/grantFundTask.service';
import { CancelRequestSchema } from '../cancelRequest/cancelRequest.model';
import { CancelRequestService } from '../cancelRequest/cancelRequest.service';
import { PayoutService } from '../payout/payout.service';
import { PayoutSchema } from '../payout/Payout.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFund', schema: GrantFundSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFundTask', schema: GrantFundTaskSchema }]),
    MongooseModule.forFeature([{ name: 'Payout', schema: PayoutSchema }]),
    MongooseModule.forFeature([{ name: 'CancelRequest', schema: CancelRequestSchema }])
  ],
  controllers: [GrantController],
  providers: [
    GrantService,
    GrantFundService,
    ImageUploadService,
    GrantFundTaskService,
    CancelRequestService,
    PayoutService,
    ScheduleService
  ]
})
export class GrantModule { }