import { LogEtherVestingCreated } from "../generated/EtherVestingFactory/EtherVestingFactory";
import {
    LogDeposit,
    LogReleased,
    LogRevoked
} from "../generated/EtherVesting/EtherVesting";

export function handleLogEtherVestingCreated(
    event: LogEtherVestingCreated
): void {}

export function handleLogDeposit(event: LogDeposit): void {}
export function handleLogReleased(event: LogReleased): void {}
export function handleLogRevoked(event: LogRevoked): void {}
