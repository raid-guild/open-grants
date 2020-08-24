import { Bytes } from "@graphprotocol/graph-ts";
import {
    LogFunding,
    LogPayment
} from "../generated/templates/UnmanagedStream/UnmanagedStream";

import { LogNewGrant } from "../generated/UnmanagedStreamFactory/UnmanagedStreamFactory";
import { fetchGrantInfo } from "./helpers";
import { Fund, Payment, Grant } from "../generated/schema";

export function handleLogNewGrant(event: LogNewGrant): void {
    let id = event.params.grant.toHexString();

    let grant = new Grant(id);
    grant.factoryAddress = event.address;
    grant.createBy = event.transaction.from;
    grant.grantId = event.params.id;
    grant.grantAddress = event.params.grant;
    grant.grantees = event.params.grantees as Array<Bytes>;
    grant.amounts = event.params.amounts;

    let fetchedGrant = fetchGrantInfo(event.params.grant);
    grant.totalFunded = fetchedGrant.totalFunded;
    grant.uri = fetchedGrant.uri;

    grant.funds = new Array<string>();
    grant.payments = new Array<string>();

    grant.save();
}

export function handleLogFunding(event: LogFunding): void {
    let fund = new Fund(event.transaction.hash.toHex());
    fund.grantAddress = event.address;
    fund.donor = event.params.donor;
    fund.amount = event.params.value;
    fund.save();

    let grant = Grant.load(event.address.toHexString());
    if (grant !== null) {
        let fetchedGrant = fetchGrantInfo(event.address);
        grant.totalFunded = fetchedGrant.totalFunded;
        grant.funds.push(fund.id);
        grant.save();
    }
}

export function handleLogPayment(event: LogPayment): void {
    let payment = new Payment(event.transaction.hash.toHex());
    payment.grantee = event.params.grantee;
    payment.grantAddress = event.address;
    payment.amount = event.params.value;
    payment.save();

    let grant = Grant.load(event.address.toHexString());
    if (grant !== null) {
        grant.payments.push(payment.id);
        grant.save();
    }
}
