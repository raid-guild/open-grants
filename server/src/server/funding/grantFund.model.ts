import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
var Schema = mongoose.Schema;

var statusEnum = {
    ACTIVE: "active",
    WITHDRAW: "withdraw",
    REFUND: "refund"
}

export const GrantFundSchema = new mongoose.Schema(
    {
        grant: { type: Schema.Types.ObjectId, ref: "Grant", required: true },
        donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: statusEnum, default: statusEnum.ACTIVE },
        fundingAmount: { type: Number, required: true },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
)
export enum grantEnum {
    ACTIVE
}
export class grantswagger {
    @ApiProperty()
    _id: String;
    @ApiProperty()
    grant: String;
    @ApiProperty()
    donor: String;
    @ApiProperty()
    status: grantEnum;
    @ApiProperty()
    fundingAmount: Number;
    @ApiProperty()
    isActive: Boolean;


}

export interface GrantFund extends mongoose.Document {
    _id: string;
    grant: string;
    donor: string;
    fundingAmount: number;
    isActive: boolean;
}