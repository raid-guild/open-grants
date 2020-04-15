import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalSchema } from './signal.model';
import { SignalController } from './signal.controller';
import { SignalService } from './signal.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Signal', schema: SignalSchema }]),
  ],
  controllers: [SignalController],
  providers: [SignalService]
})
export class SignalModule { }