import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
var Schema = mongoose.Schema;

var statusEnum = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    FAILED: "failed"
}

var reqStatusEnum = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECT: "rejected"
}

export const PayoutSchema = new mongoose.Schema(
    {
        grantManager: { type: String },
        grantee: { type: String },
        grant: { type: Schema.Types.ObjectId, ref: "Grant", required: true },
        requestAmount: { type: Number, required: true },
        status: { type: statusEnum },
        hash: { type: String },
        requestStatus: { type: statusEnum, default: reqStatusEnum.PENDING },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
)


export interface Payout extends mongoose.Document {
    grantManager: string;
    grantee: string;
    grant: string;
    requestAmount: number;
    status: string;
    hash: string;
    requestStatus: string;
    isActive: boolean;
}