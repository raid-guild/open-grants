import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
var Schema = mongoose.Schema;

var statusEnum = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    FAILED: "failed"
}

var typeEnum = {
    SINGLE: "singleDeliveryDate",
    MULTIPLE: "multipleMilestones"
}

export enum EnvConfig {
    SINGLE,
    MULTIPLE
}
var currencyEnum = {
    WEI: "wei",
    ETH: "ETH"
}

export enum currencyConfig {
    WEI,
}
export const GrantSchema = new mongoose.Schema(
    {
        grantName: { type: String, required: true },
        images: [],
        description: { type: String },
        type: { type: typeEnum, default: typeEnum.SINGLE },
        singleDeliveryDate: {
            fundingExpiryDate: Date,
            completionDate: Date,
        },
        multipleMilestones: [
            {
                milestoneNumber: Number,
                completionDate: Date
            }
        ],
        grantManager: { type: String, required: true },
        grantees: [
            {
                grantee: { type: String, required: true },
                allocationAmount: { type: Number, required: true },
                payedAmount: { type: Number, default: 0 }
            }
        ],
        donors: [{ type: String, required: true }],
        targetFunding: { type: Number, required: true },
        totalFunding: { type: Number, default: 0 },
        totalPayed: { type: Number, default: 0 },
        canFund: { type: Boolean, default: true },
        currency: { type: currencyEnum, default: currencyEnum.WEI },
        cancelBy: { type: String },
        createdBy: { type: String, required: true },
        status: { type: statusEnum, default: statusEnum.PENDING },
        contractId: { type: String, required: true, unique: true },
        hash: { type: String, required: true },
        failedReason: { type: String },
        content: { type: String },
        isActive: { type: Boolean, default: true },
        isCancel: { type: Boolean, default: false }
    },
    { timestamps: true }
)

export class grantswagger {

    @ApiProperty()
    grantName: String;
    @ApiProperty()
    grantLink: String;
    @ApiProperty()
    type: EnvConfig;
    @ApiProperty()
    singleDeliveryDate: {
        fundingExpiryDate: Date,
        completionDate: Date,
    }
    @ApiProperty()
    multipleMilestones: [
        {
            milestoneNumber: Number,
            completionDate: Date
        }
    ]
    @ApiProperty()
    grantManager: String;
    @ApiProperty()
    grantees: [
        {
            grantee: String,
            allocationAmount: Number,
            payedAmount: Number
        }
    ];
    @ApiProperty()
    createdBy: String
    @ApiProperty()
    targetFunding: Number;
    @ApiProperty()
    totalFunding: Number;
    @ApiProperty()
    totalPayed: Number;
    @ApiProperty()
    currency: currencyConfig;
}

export class grantUpdateswagger {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    grantName: String;
    @ApiProperty()
    grantLink: String;
    @ApiProperty()
    type: EnvConfig;
    @ApiProperty()
    singleDeliveryDate: {
        fundingExpiryDate: Date,
        completionDate: Date,
    }
    @ApiProperty()
    multipleMilestones: [
        {
            milestoneNumber: Number,
            completionDate: Date
        }
    ]
    @ApiProperty()
    grantManager: String;
    @ApiProperty()
    grantees: [
        {
            grantee: String,
            allocationAmount: Number,
            payedAmount: Number
        }
    ];
    @ApiProperty()
    createdBy: String
    @ApiProperty()
    targetFunding: Number;
    @ApiProperty()
    totalFunding: Number;
    @ApiProperty()
    totalPayed: Number;
    @ApiProperty()
    currency: currencyConfig;
}




export interface Grant extends mongoose.Document {
    _id: string;
    grantName: string;
    images: [],
    description: string,
    type: string;
    singleDeliveryDate: object;
    multipleMilestones: [
        {
            milestoneNumber: number,
            completionDate: Date
        }
    ];
    grantManager: string;
    grantees: [
        {
            grantee: string,
            allocationAmount: number,
            payedAmount: number
        }
    ];
    donors: [];
    targetFunding: number;
    totalFunding: number;
    totalPayed: number;
    currency: string;
    createdBy: string;
    cancelBy: string;
    status: string;
    content: string;
    contractId: string;
    hash: string;
    canFund: boolean;
    createdAt: any;
    isCancel: boolean
    isActive: boolean;
}