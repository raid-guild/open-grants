import {
    BigInt,
    Bytes,
    Address,
} from "@graphprotocol/graph-ts";

import { UnmanagedStream } from "../generated/templates/UnmanagedStream/UnmanagedStream";

class GrantObject {
    uri: Bytes;
    totalFunded: BigInt;
}

export function fetchGrantInfo(
    address: Address
): GrantObject | null {
    let grantInstance = UnmanagedStream.bind(address);
    let grantObject = new GrantObject();

    let uri = grantInstance.try_getUri();
    let totalFunding = grantInstance.try_getTotalFunding();

    if (!totalFunding.reverted) {
        grantObject.totalFunded = totalFunding.value;
    }

    if (!uri.reverted) {
        grantObject.uri = uri.value;
    }

    return grantObject;
}
