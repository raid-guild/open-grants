import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ENVIRONMENT } from 'src/environments/environment';
import gql from 'graphql-tag';

@Injectable()
export class SubgraphService {

  constructor(private apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: ENVIRONMENT.SUBGRAPH_QUERIE }),
      cache: new InMemoryCache()
    })
  }

  getGrantList() {
    return this.apollo.query({
      query: gql`query getContracts{
        contracts(orderBy:grantId) {
          id
          contractAddress
          grantId
          grantAddress
          canFund
          grantAddress
          manager
          currency
          targetFunding
          totalFunding
          availableBalance
          grantCancelled
          fundingExpiration
          contractExpiration
        }
      }`,
    })
  }

  getGrantByAddress(grantAddress: string) {
    return this.apollo.query({
      query: gql`query getContract($grantAddress: String){
        contract(id: $grantAddress) {
          id
          contractAddress
          grantId
          grantAddress
          canFund
          grantAddress
          manager
          currency
          targetFunding
          totalFunding
          availableBalance
          grantCancelled
          fundingExpiration
          contractExpiration
        }
      }`,
      variables: { grantAddress: grantAddress }
    })
  }

  getFundByContractAndDonor(contract: string, donor: string) {
    return this.apollo.query({
      query: gql`query getFunds($contract: String,$donor: String){
      funds(where: {
        contract: $contract,
        donor: $donor
        }) {
        id
        contract
        donor
        amount
        }
      }`,
      variables: { contract: contract, donor: donor }
    })
  }

  getFundByContract(contract: string) {
    return this.apollo.query({
      query: gql`query getFunds($contract: String){
      funds(where: {
        contract: $contract
        }) {
        id
        contract
        donor
        amount
        }
      }`,
      variables: { contract: contract }
    })
  }

  getPaymentByContractAndDonor(contract: string, grantee: string) {
    return this.apollo.query({
      query: gql`query getPayments($contract: String,$grantee: String){
      payments(where: {
        contract: $contract,
        grantee: $grantee
        }) {
        id
        contract
        grantee
        amount
        }
      }`,
      variables: { contract: contract, grantee: grantee }
    })
  }
}
