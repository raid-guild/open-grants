import { Inject, Injectable } from '@angular/core';
import { BoxOptions, GetProfileOptions, Threebox } from './3box';
import * as Box from '3box';
const { profileGraphQL, getProfile, getProfiles, getVerifiedAccounts } = require('3box/lib/api')

declare let window: any;
declare let require: any;

@Injectable({ providedIn: 'root' })
export class ThreeBoxService {

  constructor() {
    (async () => {
      // await window.ethereum.enable()
      // const profile = await getProfile(window.web3.eth.coinbase)
      // console.log("profile", profile);
    })();
  }

  async getUserProfile(address: string, options?: GetProfileOptions) {
    console.log("address", address);
    // await window.ethereum.enable()
    // const profile = await Box.getProfile(window.web3.eth.coinbase)

    const query = `{ 
      profile(id: "${address}" ) {
        image
        name
        emoji
        location
      } 
    }`

    try {
      let res = await profileGraphQL(query);
      console.log("res", res.profile);
      return res.profile;
    } catch (e) {
      return [];
    }
  }

}