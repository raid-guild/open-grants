import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
var Schema = mongoose.Schema;

var statusEnum = {
    PENDING: "pending",
    ACTIVE: "active",
    CANCEL: "cancel"
}

var typeEnum = {
    SINGLE: "singleDeliveryDate",
    MULTIPLE: "multipleMilestones"
}

export const SignalSchema = new mongoose.Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        grant: { type: Schema.Types.ObjectId, ref: "Grant", required: true },
        signal: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)


export interface Signal extends mongoose.Document {
    user: string,
    grant: string,
    signal: Boolean,
    isActive: Boolean
}