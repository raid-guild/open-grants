import {
    BigInt,
    BigDecimal,
    log,
    Bytes,
    Address,
} from "@graphprotocol/graph-ts";
import { ManagedCappedGrant } from "../generated/GrantFactory/ManagedCappedGrant";
import { GrantFactory } from "../generated/GrantFactory/GrantFactory";

class GrantObject {
    uri: Bytes;
    manager: Address;
    currency: Address;
    targetFunding: BigInt;
    totalFunding: BigInt;
    availableBalance: BigInt;
    totalPayed: BigInt;
    canFund: boolean;
    grantCancelled: boolean
    fundingDeadline: BigInt;
    contractExpiration: BigInt;
}

export function returnGrantsInfo(
    address: Address
): GrantObject | null {
    let grantInstance = ManagedCappedGrant.bind(address);
    let grantObject = new GrantObject();

    let canFund = grantInstance.try_canFund();
    let manager = grantInstance.try_manager();
    let currency = grantInstance.try_currency();
    let targetFunding = grantInstance.try_targetFunding();
    let totalFunding = grantInstance.try_totalFunding();
    let availableBalance = grantInstance.try_availableBalance();
    let totalPayed = grantInstance.try_totalPaid();
    let grantCancelled = grantInstance.try_grantCancelled();
    let fundingDeadline = grantInstance.try_fundingDeadline();
    let contractExpiration = grantInstance.try_contractExpiration();
    let uri = grantInstance.try_uri();

    if (!canFund.reverted) {
        grantObject.canFund = canFund.value;
    }

    if (!manager.reverted) {
        grantObject.manager = manager.value;
    }

    if (!currency.reverted) {
        grantObject.currency = currency.value;
    }

    if (!targetFunding.reverted) {
        grantObject.targetFunding = targetFunding.value;
    }

    if (!totalFunding.reverted) {
        grantObject.totalFunding = totalFunding.value;
    }

    if (!totalPayed.reverted) {
        grantObject.totalPayed = totalPayed.value;
    }

    if (!availableBalance.reverted) {
        grantObject.availableBalance = availableBalance.value;
    }

    if (!grantCancelled.reverted) {
        grantObject.grantCancelled = grantCancelled.value;
    }

    if (!fundingDeadline.reverted) {
        grantObject.fundingDeadline = fundingDeadline.value;
    }

    if (!contractExpiration.reverted) {
        grantObject.contractExpiration = contractExpiration.value;
    }

    if (!uri.reverted) {
        grantObject.uri = uri.value;
    }

    return grantObject;
}