import { BigInt, BigDecimal, log } from '@graphprotocol/graph-ts'


export function BigIntEth(): BigInt {
    let halfEthBigInt = BigInt.fromI32(1000000000)
    return halfEthBigInt.times(halfEthBigInt)
}