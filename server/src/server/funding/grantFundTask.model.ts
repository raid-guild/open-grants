import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var statusEnum = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    FAILED: "failed"
}

export const GrantFundTaskSchema = new mongoose.Schema(
    {
        grant: { type: Schema.Types.ObjectId, ref: "Grant", required: true },
        donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        status: { type: statusEnum, default: statusEnum.PENDING },
        hash: { type: String, required: true },
        failedReason: { type: String },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
)

export interface GrantFundTask extends mongoose.Document {
    _id: string;
    grant: string;
    donor: string;
    amount: number;
    status: string;
    hash: string;
    failedReason: string;
    isActive: boolean;
}