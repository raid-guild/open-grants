import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const UserSchema = new mongoose.Schema(
  {
    publicAddress: { type: String, unique: true, required: true },
    nonce: { type: String, unique: true, required: true, default: Math.floor(Math.random() * 1000000) },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export class userswagger {

  @ApiProperty()
  _id: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  picture: string;

  @ApiProperty()
  publicAddress: string

  @ApiProperty()
  isActive: Boolean;
}

export class authswagger {

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  picture: string;

  @ApiProperty()
  publicAddress: string

  @ApiProperty()
  isActive: Boolean;
}

export class Loginswagger {

  @ApiProperty()
  userName: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  profile: any;
}

export interface User extends mongoose.Document {
  _id: string;
  userName: string;
  email: string;
  publicAddress: string;
  isActive: boolean;
  picture: string;
}