import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { UserController } from './user.controller'
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';
import { ImageUploadService } from '../../helpers/imageUpload.Service';
import { Utils } from '../../helpers/utils';

@Module({
  imports: [
    MulterModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService, Utils, ImageUploadService]
})
export class UserModule { }