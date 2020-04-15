import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Utils } from '../../helpers/utils';
import { JWTHelper } from '../../helpers/jwt.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService,Utils,JWTHelper]
})
export class AuthModule { }