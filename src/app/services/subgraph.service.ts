import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class SubgraphService {

  constructor(private apollo: Apollo) {}

  getGrantList() {
    return this.apollo.query({
      query: gql`query getContracts{
        contracts {
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
      }`
    });
  }

  // getGrantList(skip: number, first: number) {
  //   return this.apollo.query({
  //     query: gql`query getContracts($skip: Int, $first: Int){
  //       contracts(skip: $skip,first:$first) {
  //         id
  //         uri
  //         contractAddress
  //         grantId
  //         grantAddress
  //         canFund
  //         grantAddress
  //         manager
  //         createBy
  //         currency
  //         targetFunding
  //         totalFunding
  //         availableBalance
  //         grantCancelled
  //         fundingExpiration
  //         contractExpiration
  //       }
  //     }`,
  //     variables: { skip: skip, first: first }
  //   })
  // }

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
      variables: { grantAddress }
    });
  }

  getGrantByCreateby(createBy: string) {
    return this.apollo.query({
      query: gql`query getContract($createBy: String){
        contracts(where: {
          createBy: $createBy
        }) {
          id
          input
          uri
          contractAddress
          grantId
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
      variables: { createBy }
    });
  }

  getManageByCreateby(manager: string) {
    return this.apollo.query({
      query: gql`query getContract($manager: String){
        contracts(where: {
          manager: $manager
        }) {
          id
          input
          uri
          contractAddress
          grantId
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
      variables: { manager }
    });
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
      variables: { grantAddress, donor }
    });
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
      variables: { grantAddress }
    });
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
      variables: { grantAddress, grantee }
    });
  }
}
