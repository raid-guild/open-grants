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

  getGrantList(skip: number, first: number) {
    return this.apollo.query({
      query: gql`query getContracts{
        contracts(skip: $skip, first: $first,orderDirection:asc) {
          id
          uri
          contractAddress
          grantId
          grantAddress
          canFund
          grantAddress
          manager
          createBy
          currency
          targetFunding
          totalFunding
          availableBalance
          grantCancelled
          fundingExpiration
          contractExpiration
        }
      }`,
      variables: { skip: skip, first: first }
    })
  }

  getGrantByAddress(grantAddress: string) {
    return this.apollo.query({
      query: gql`query getContract($grantAddress: String){
        contract(id: $grantAddress) {
          id
          input
          uri
          contractAddress
          grantId
          grantAddress
          canFund
          grantAddress
          manager
          createBy
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

  getFundByContractAndDonor(grantAddress: string, donor: string) {
    return this.apollo.query({
      query: gql`query getFunds($grantAddress: String,$donor: String){
      funds(where: {
        grantAddress: $grantAddress,
        donor: $donor
        }) {
        id
        grantAddress
        donor
        amount
        }
      }`,
      variables: { grantAddress: grantAddress, donor: donor }
    })
  }

  getFundByContract(grantAddress: string) {
    return this.apollo.query({
      query: gql`query getFunds($grantAddress: String){
      funds(where: {
        grantAddress: $grantAddress
        }) {
        id
        grantAddress
        donor
        amount
        }
      }`,
      variables: { grantAddress: grantAddress }
    })
  }

  getPaymentByContractAndDonor(grantAddress: string, grantee: string) {
    return this.apollo.query({
      query: gql`query getPayments($grantAddress: String,$grantee: String){
      payments(where: {
        grantAddress: $grantAddress,
        grantee: $grantee
        }) {
        id
        grantAddress
        grantee
        amount
        }
      }`,
      variables: { grantAddress: grantAddress, grantee: grantee }
    })
  }
}
