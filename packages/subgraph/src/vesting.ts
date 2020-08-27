import { LogEtherVestingCreated } from "../generated/EtherVestingFactory/EtherVestingFactory";
import {
    LogDeposit,
    LogReleased,
    LogRevoked
} from "../generated/EtherVesting/EtherVesting";
import { Vesting } from "../generated/schema";

export function handleLogEtherVestingCreated(
    event: LogEtherVestingCreated
): void {
    // let grant = new Grant(event.params.grant.toHexString());
    // grant.factoryAddress = event.address;
    // grant.createBy = event.transaction.from;
    // grant.grantId = event.params.id;
    // grant.grantAddress = event.params.grant;
    // grant.grantees = event.params.grantees as Array<Bytes>;
    // grant.amounts = event.params.amounts;

    // let fetchedGrant = fetchGrantInfo(event.params.grant);
    // grant.totalFunded = fetchedGrant.totalFunded;
    // grant.uri = fetchedGrant.uri;

    // grant.funds = new Array<string>();
    // grant.payments = new Array<string>();

    // grant.save();
    // log.info("New Grant {}", [grant.id]);
}

export function handleLogDeposit(event: LogDeposit): void {}
export function handleLogReleased(event: LogReleased): void {}
export function handleLogRevoked(event: LogRevoked): void {}
