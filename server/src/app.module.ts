import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from 'nest-schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './server/user/user.module';
import { AuthModule } from './server/auth/auth.module';
import { GrantModule } from './server/grant/grant.module';
import { GrantFundModule } from './server/funding/grantFund.module';
import { SignalModule } from './server/signal/signal.module';
import { PayoutModule } from './server/payout/payout.module';
import { CancelRequestModule } from './server/cancelRequest/cancelRequest.module';
import { GrantService } from './server/grant/grant.service';
import { GrantFundService } from './server/funding/grantFund.service';
import { GrantFundTaskService } from './server/funding/grantFundTask.service';
import { CancelRequestService } from './server/cancelRequest/cancelRequest.service';
import { ScheduleService } from './helpers/schedule.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/Grants-platform', { useNewUrlParser: true }),
    AuthModule,
    UserModule,
    GrantModule,
    GrantFundModule,
    SignalModule,
    PayoutModule,
    CancelRequestModule,
    ScheduleModule.register({
      waiting: true
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'files')
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
