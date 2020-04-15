import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
var Schema = mongoose.Schema;

var statusEnum = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    FAILED: "failed"
}

export const CancelRequestSchema = new mongoose.Schema(
    {
        grant: { type: Schema.Types.ObjectId, ref: "Grant", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        hash: { type: String, required: true },
        status: { type: statusEnum, default: statusEnum.PENDING }
    },
    { timestamps: true }
)


export interface CancelRequest extends mongoose.Document {
    grant: string;
    user: string;
    hash: string;
    status: string;
}