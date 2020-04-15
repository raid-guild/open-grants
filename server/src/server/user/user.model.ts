import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    picture: { type: String },
    publicKey: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export class userswagger {

  @ApiProperty()
  _id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  picture: string;

  @ApiProperty()
  publicKey: string

  @ApiProperty()
  isActive: Boolean;
}

export class authswagger {

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  picture: string;

  @ApiProperty()
  publicKey: string

  @ApiProperty()
  isActive: Boolean;
}

export class Loginswagger {

  @ApiProperty()
  userName: string;

  @ApiProperty()
  password: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  profile: any;
}

export interface User extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: String;
  userName: string;
  email: string;
  password: string;
  picture: string;
  publicKey: string;
  isActive: boolean;
}