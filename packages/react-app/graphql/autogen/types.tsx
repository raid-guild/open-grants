/* eslint-disable */
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};

export type Deposit = {
  __typename?: 'Deposit';
  id: Scalars['ID'];
  streamAddress: Scalars['Bytes'];
  depositer: Scalars['Bytes'];
  amount: Scalars['BigInt'];
};

export type Deposit_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  streamAddress?: Maybe<Scalars['Bytes']>;
  streamAddress_not?: Maybe<Scalars['Bytes']>;
  streamAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  streamAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  streamAddress_contains?: Maybe<Scalars['Bytes']>;
  streamAddress_not_contains?: Maybe<Scalars['Bytes']>;
  depositer?: Maybe<Scalars['Bytes']>;
  depositer_not?: Maybe<Scalars['Bytes']>;
  depositer_in?: Maybe<Array<Scalars['Bytes']>>;
  depositer_not_in?: Maybe<Array<Scalars['Bytes']>>;
  depositer_contains?: Maybe<Scalars['Bytes']>;
  depositer_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Deposit_OrderBy {
  Id = 'id',
  StreamAddress = 'streamAddress',
  Depositer = 'depositer',
  Amount = 'amount',
}

export type Fund = {
  __typename?: 'Fund';
  id: Scalars['ID'];
  grantAddress: Scalars['Bytes'];
  donor: Scalars['Bytes'];
  amount: Scalars['BigInt'];
};

export type Fund_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  grantAddress?: Maybe<Scalars['Bytes']>;
  grantAddress_not?: Maybe<Scalars['Bytes']>;
  grantAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  grantAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  grantAddress_contains?: Maybe<Scalars['Bytes']>;
  grantAddress_not_contains?: Maybe<Scalars['Bytes']>;
  donor?: Maybe<Scalars['Bytes']>;
  donor_not?: Maybe<Scalars['Bytes']>;
  donor_in?: Maybe<Array<Scalars['Bytes']>>;
  donor_not_in?: Maybe<Array<Scalars['Bytes']>>;
  donor_contains?: Maybe<Scalars['Bytes']>;
  donor_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Fund_OrderBy {
  Id = 'id',
  GrantAddress = 'grantAddress',
  Donor = 'donor',
  Amount = 'amount',
}

export type Grant = {
  __typename?: 'Grant';
  id: Scalars['ID'];
  factoryAddress: Scalars['Bytes'];
  grantId: Scalars['BigInt'];
  grantAddress: Scalars['Bytes'];
  uri: Scalars['Bytes'];
  createBy: Scalars['Bytes'];
  grantees?: Maybe<Array<Scalars['Bytes']>>;
  funds?: Maybe<Array<Fund>>;
  payments?: Maybe<Array<Payment>>;
  amounts?: Maybe<Array<Scalars['BigInt']>>;
  totalFunded: Scalars['BigInt'];
};

export type GrantFundsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Fund_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Fund_Filter>;
};

export type GrantPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Payment_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Payment_Filter>;
};

export type Grant_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  factoryAddress?: Maybe<Scalars['Bytes']>;
  factoryAddress_not?: Maybe<Scalars['Bytes']>;
  factoryAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  factoryAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  factoryAddress_contains?: Maybe<Scalars['Bytes']>;
  factoryAddress_not_contains?: Maybe<Scalars['Bytes']>;
  grantId?: Maybe<Scalars['BigInt']>;
  grantId_not?: Maybe<Scalars['BigInt']>;
  grantId_gt?: Maybe<Scalars['BigInt']>;
  grantId_lt?: Maybe<Scalars['BigInt']>;
  grantId_gte?: Maybe<Scalars['BigInt']>;
  grantId_lte?: Maybe<Scalars['BigInt']>;
  grantId_in?: Maybe<Array<Scalars['BigInt']>>;
  grantId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  grantAddress?: Maybe<Scalars['Bytes']>;
  grantAddress_not?: Maybe<Scalars['Bytes']>;
  grantAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  grantAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  grantAddress_contains?: Maybe<Scalars['Bytes']>;
  grantAddress_not_contains?: Maybe<Scalars['Bytes']>;
  uri?: Maybe<Scalars['Bytes']>;
  uri_not?: Maybe<Scalars['Bytes']>;
  uri_in?: Maybe<Array<Scalars['Bytes']>>;
  uri_not_in?: Maybe<Array<Scalars['Bytes']>>;
  uri_contains?: Maybe<Scalars['Bytes']>;
  uri_not_contains?: Maybe<Scalars['Bytes']>;
  createBy?: Maybe<Scalars['Bytes']>;
  createBy_not?: Maybe<Scalars['Bytes']>;
  createBy_in?: Maybe<Array<Scalars['Bytes']>>;
  createBy_not_in?: Maybe<Array<Scalars['Bytes']>>;
  createBy_contains?: Maybe<Scalars['Bytes']>;
  createBy_not_contains?: Maybe<Scalars['Bytes']>;
  grantees?: Maybe<Array<Scalars['Bytes']>>;
  grantees_not?: Maybe<Array<Scalars['Bytes']>>;
  grantees_contains?: Maybe<Array<Scalars['Bytes']>>;
  grantees_not_contains?: Maybe<Array<Scalars['Bytes']>>;
  funds?: Maybe<Array<Scalars['String']>>;
  funds_not?: Maybe<Array<Scalars['String']>>;
  funds_contains?: Maybe<Array<Scalars['String']>>;
  funds_not_contains?: Maybe<Array<Scalars['String']>>;
  payments?: Maybe<Array<Scalars['String']>>;
  payments_not?: Maybe<Array<Scalars['String']>>;
  payments_contains?: Maybe<Array<Scalars['String']>>;
  payments_not_contains?: Maybe<Array<Scalars['String']>>;
  amounts?: Maybe<Array<Scalars['BigInt']>>;
  amounts_not?: Maybe<Array<Scalars['BigInt']>>;
  amounts_contains?: Maybe<Array<Scalars['BigInt']>>;
  amounts_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  totalFunded?: Maybe<Scalars['BigInt']>;
  totalFunded_not?: Maybe<Scalars['BigInt']>;
  totalFunded_gt?: Maybe<Scalars['BigInt']>;
  totalFunded_lt?: Maybe<Scalars['BigInt']>;
  totalFunded_gte?: Maybe<Scalars['BigInt']>;
  totalFunded_lte?: Maybe<Scalars['BigInt']>;
  totalFunded_in?: Maybe<Array<Scalars['BigInt']>>;
  totalFunded_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Grant_OrderBy {
  Id = 'id',
  FactoryAddress = 'factoryAddress',
  GrantId = 'grantId',
  GrantAddress = 'grantAddress',
  Uri = 'uri',
  CreateBy = 'createBy',
  Grantees = 'grantees',
  Funds = 'funds',
  Payments = 'payments',
  Amounts = 'amounts',
  TotalFunded = 'totalFunded',
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Payment = {
  __typename?: 'Payment';
  id: Scalars['ID'];
  grantAddress: Scalars['Bytes'];
  grantee: Scalars['Bytes'];
  amount: Scalars['BigInt'];
};

export type Payment_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  grantAddress?: Maybe<Scalars['Bytes']>;
  grantAddress_not?: Maybe<Scalars['Bytes']>;
  grantAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  grantAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  grantAddress_contains?: Maybe<Scalars['Bytes']>;
  grantAddress_not_contains?: Maybe<Scalars['Bytes']>;
  grantee?: Maybe<Scalars['Bytes']>;
  grantee_not?: Maybe<Scalars['Bytes']>;
  grantee_in?: Maybe<Array<Scalars['Bytes']>>;
  grantee_not_in?: Maybe<Array<Scalars['Bytes']>>;
  grantee_contains?: Maybe<Scalars['Bytes']>;
  grantee_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Payment_OrderBy {
  Id = 'id',
  GrantAddress = 'grantAddress',
  Grantee = 'grantee',
  Amount = 'amount',
}

export type Query = {
  __typename?: 'Query';
  grant?: Maybe<Grant>;
  grants: Array<Grant>;
  fund?: Maybe<Fund>;
  funds: Array<Fund>;
  payment?: Maybe<Payment>;
  payments: Array<Payment>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  release?: Maybe<Release>;
  releases: Array<Release>;
};

export type QueryGrantArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryGrantsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Grant_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Grant_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryFundArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryFundsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Fund_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Fund_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryPaymentArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Payment_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Payment_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryStreamArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStreamsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Stream_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Stream_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryDepositArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryDepositsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryReleaseArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryReleasesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Release_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Release_Filter>;
  block?: Maybe<Block_Height>;
};

export type Release = {
  __typename?: 'Release';
  id: Scalars['ID'];
  streamAddress: Scalars['Bytes'];
  amount: Scalars['BigInt'];
};

export type Release_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  streamAddress?: Maybe<Scalars['Bytes']>;
  streamAddress_not?: Maybe<Scalars['Bytes']>;
  streamAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  streamAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  streamAddress_contains?: Maybe<Scalars['Bytes']>;
  streamAddress_not_contains?: Maybe<Scalars['Bytes']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Release_OrderBy {
  Id = 'id',
  StreamAddress = 'streamAddress',
  Amount = 'amount',
}

export type Stream = {
  __typename?: 'Stream';
  id: Scalars['ID'];
  factoryAddress: Scalars['Bytes'];
  streamId: Scalars['BigInt'];
  streamAddress: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  beneficiary: Scalars['Bytes'];
  isRevocable: Scalars['Boolean'];
  isRevoked: Scalars['Boolean'];
  deposits?: Maybe<Array<Deposit>>;
  releases?: Maybe<Array<Release>>;
  released: Scalars['BigInt'];
  startTime: Scalars['BigInt'];
  duration: Scalars['BigInt'];
};

export type StreamDepositsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
};

export type StreamReleasesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Release_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Release_Filter>;
};

export type Stream_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  factoryAddress?: Maybe<Scalars['Bytes']>;
  factoryAddress_not?: Maybe<Scalars['Bytes']>;
  factoryAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  factoryAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  factoryAddress_contains?: Maybe<Scalars['Bytes']>;
  factoryAddress_not_contains?: Maybe<Scalars['Bytes']>;
  streamId?: Maybe<Scalars['BigInt']>;
  streamId_not?: Maybe<Scalars['BigInt']>;
  streamId_gt?: Maybe<Scalars['BigInt']>;
  streamId_lt?: Maybe<Scalars['BigInt']>;
  streamId_gte?: Maybe<Scalars['BigInt']>;
  streamId_lte?: Maybe<Scalars['BigInt']>;
  streamId_in?: Maybe<Array<Scalars['BigInt']>>;
  streamId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  streamAddress?: Maybe<Scalars['Bytes']>;
  streamAddress_not?: Maybe<Scalars['Bytes']>;
  streamAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  streamAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  streamAddress_contains?: Maybe<Scalars['Bytes']>;
  streamAddress_not_contains?: Maybe<Scalars['Bytes']>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  beneficiary?: Maybe<Scalars['Bytes']>;
  beneficiary_not?: Maybe<Scalars['Bytes']>;
  beneficiary_in?: Maybe<Array<Scalars['Bytes']>>;
  beneficiary_not_in?: Maybe<Array<Scalars['Bytes']>>;
  beneficiary_contains?: Maybe<Scalars['Bytes']>;
  beneficiary_not_contains?: Maybe<Scalars['Bytes']>;
  isRevocable?: Maybe<Scalars['Boolean']>;
  isRevocable_not?: Maybe<Scalars['Boolean']>;
  isRevocable_in?: Maybe<Array<Scalars['Boolean']>>;
  isRevocable_not_in?: Maybe<Array<Scalars['Boolean']>>;
  isRevoked?: Maybe<Scalars['Boolean']>;
  isRevoked_not?: Maybe<Scalars['Boolean']>;
  isRevoked_in?: Maybe<Array<Scalars['Boolean']>>;
  isRevoked_not_in?: Maybe<Array<Scalars['Boolean']>>;
  deposits?: Maybe<Array<Scalars['String']>>;
  deposits_not?: Maybe<Array<Scalars['String']>>;
  deposits_contains?: Maybe<Array<Scalars['String']>>;
  deposits_not_contains?: Maybe<Array<Scalars['String']>>;
  releases?: Maybe<Array<Scalars['String']>>;
  releases_not?: Maybe<Array<Scalars['String']>>;
  releases_contains?: Maybe<Array<Scalars['String']>>;
  releases_not_contains?: Maybe<Array<Scalars['String']>>;
  released?: Maybe<Scalars['BigInt']>;
  released_not?: Maybe<Scalars['BigInt']>;
  released_gt?: Maybe<Scalars['BigInt']>;
  released_lt?: Maybe<Scalars['BigInt']>;
  released_gte?: Maybe<Scalars['BigInt']>;
  released_lte?: Maybe<Scalars['BigInt']>;
  released_in?: Maybe<Array<Scalars['BigInt']>>;
  released_not_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime?: Maybe<Scalars['BigInt']>;
  startTime_not?: Maybe<Scalars['BigInt']>;
  startTime_gt?: Maybe<Scalars['BigInt']>;
  startTime_lt?: Maybe<Scalars['BigInt']>;
  startTime_gte?: Maybe<Scalars['BigInt']>;
  startTime_lte?: Maybe<Scalars['BigInt']>;
  startTime_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  duration?: Maybe<Scalars['BigInt']>;
  duration_not?: Maybe<Scalars['BigInt']>;
  duration_gt?: Maybe<Scalars['BigInt']>;
  duration_lt?: Maybe<Scalars['BigInt']>;
  duration_gte?: Maybe<Scalars['BigInt']>;
  duration_lte?: Maybe<Scalars['BigInt']>;
  duration_in?: Maybe<Array<Scalars['BigInt']>>;
  duration_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Stream_OrderBy {
  Id = 'id',
  FactoryAddress = 'factoryAddress',
  StreamId = 'streamId',
  StreamAddress = 'streamAddress',
  Owner = 'owner',
  Beneficiary = 'beneficiary',
  IsRevocable = 'isRevocable',
  IsRevoked = 'isRevoked',
  Deposits = 'deposits',
  Releases = 'releases',
  Released = 'released',
  StartTime = 'startTime',
  Duration = 'duration',
}

export type Subscription = {
  __typename?: 'Subscription';
  grant?: Maybe<Grant>;
  grants: Array<Grant>;
  fund?: Maybe<Fund>;
  funds: Array<Fund>;
  payment?: Maybe<Payment>;
  payments: Array<Payment>;
  stream?: Maybe<Stream>;
  streams: Array<Stream>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  release?: Maybe<Release>;
  releases: Array<Release>;
};

export type SubscriptionGrantArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionGrantsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Grant_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Grant_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionFundArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionFundsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Fund_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Fund_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionPaymentArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionPaymentsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Payment_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Payment_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionStreamArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStreamsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Stream_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Stream_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionDepositArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionDepositsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Deposit_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Deposit_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionReleaseArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionReleasesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Release_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Release_Filter>;
  block?: Maybe<Block_Height>;
};

export type GrantFragmentFragment = { __typename?: 'Grant' } & Pick<
  Grant,
  | 'id'
  | 'factoryAddress'
  | 'grantId'
  | 'grantAddress'
  | 'uri'
  | 'createBy'
  | 'grantees'
  | 'amounts'
  | 'totalFunded'
>;

export type GetGrantQueryVariables = Exact<{
  address: Scalars['ID'];
}>;

export type GetGrantQuery = { __typename?: 'Query' } & {
  grant?: Maybe<{ __typename?: 'Grant' } & GrantFragmentFragment>;
};

export type GetGrantAddressesQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
}>;

export type GetGrantAddressesQuery = { __typename?: 'Query' } & {
  grants: Array<{ __typename?: 'Grant' } & Pick<Grant, 'id'>>;
};

export type GetGrantsQueryVariables = Exact<{
  first?: Maybe<Scalars['Int']>;
}>;

export type GetGrantsQuery = { __typename?: 'Query' } & {
  grants: Array<{ __typename?: 'Grant' } & GrantFragmentFragment>;
};

export const GrantFragmentFragmentDoc = gql`
  fragment GrantFragment on Grant {
    id
    factoryAddress
    grantId
    grantAddress
    uri
    createBy
    grantees
    amounts
    totalFunded
  }
`;
export const GetGrantDocument = gql`
  query GetGrant($address: ID!) {
    grant(id: $address) {
      ...GrantFragment
    }
  }
  ${GrantFragmentFragmentDoc}
`;

export function useGetGrantQuery(
  options: Omit<Urql.UseQueryArgs<GetGrantQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<GetGrantQuery>({ query: GetGrantDocument, ...options });
}
export const GetGrantAddressesDocument = gql`
  query GetGrantAddresses($first: Int) {
    grants(first: $first) {
      id
    }
  }
`;

export function useGetGrantAddressesQuery(
  options: Omit<
    Urql.UseQueryArgs<GetGrantAddressesQueryVariables>,
    'query'
  > = {},
) {
  return Urql.useQuery<GetGrantAddressesQuery>({
    query: GetGrantAddressesDocument,
    ...options,
  });
}
export const GetGrantsDocument = gql`
  query GetGrants($first: Int) {
    grants(first: $first) {
      ...GrantFragment
    }
  }
  ${GrantFragmentFragmentDoc}
`;

export function useGetGrantsQuery(
  options: Omit<Urql.UseQueryArgs<GetGrantsQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<GetGrantsQuery>({
    query: GetGrantsDocument,
    ...options,
  });
}
