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
        name: { type: String, required: true },
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
        manager: { type: String, required: true },
        grantees: [
            {
                grantee: { type: String, required: true },
                allocationAmount: { type: Number, required: true }
            }
        ],
        targetFunding: { type: Number, required: true },
        currency: { type: currencyEnum, default: currencyEnum.WEI },
        createdBy: { type: String, required: true },
        status: { type: statusEnum, default: statusEnum.PENDING },
        contractAddress: { type: String, unique: true },
        hash: { type: String, required: true },
        content: { type: String },
        isActive: { type: Boolean, default: true },
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
    name: string;
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
    manager: string;
    grantees: [
        {
            grantee: string,
            allocationAmount: number,
        }
    ];
    targetFunding: number;
    currency: string;
    createdBy: string;
    status: string;
    content: string;
    contractAddress: string;
    hash: string;
    createdAt: any;
    isActive: boolean;
}