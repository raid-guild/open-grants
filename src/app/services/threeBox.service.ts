import { Inject, Injectable } from '@angular/core';
import Web3 from 'web3';
import { BehaviorSubject } from 'rxjs';
import * as Box from '3box';
import { BoxOptions, GetProfileOptions, Threebox } from './3box';
import { AppSettings } from '../config/app.config';
import { async } from '@angular/core/testing';
import { id } from 'ethers/utils';
import { UtilsService } from './utils.service';
import { resolve } from 'url';
const { profileGraphQL, getProfile, getProfiles, getVerifiedAccounts } = require('3box/lib/api')

declare let window: any;
declare let require: any;

@Injectable({ providedIn: 'root' })
export class ThreeBoxService {
  // box: any;
  space: any;
  thread: any;
  posts: any;
  user: any;

  spaceReady = false;


  private _box = new BehaviorSubject<Threebox>(null);
  public box$ = this._box.asObservable();

  constructor(
    private utils: UtilsService,
  ) {
    this.openBox('0x6d48912c6c768e0cad669b0154dd85f156284a21');
  }

  public get box(): Threebox {
    return this._box.getValue();
  }

  public set box(box: Threebox) {
    this._box.next(box);
  }

  public openBox(address?: string, options?: BoxOptions): Promise<Threebox> {
    return Box.openBox(
      address || window.web3.eth.defaultAccount,
      window.web3.currentProvider,
      options
    ).then(async (box) => {
      this.box = box;
      this.space = await box.openSpace("open-grant");
      console.log("space", this.space);
      this.spaceReady = true;
    }).catch(e => console.log("error", e));
  }

  async setData(data: Object) {
    return new Promise(async (resolve) => {
      let id = this.utils.generateUUID()
      let res = await this.space.public.set(id, data);
      resolve(id)
    })
  }

  async getData() {
    let res = await this.space.public.all()
    console.log("res", res)
    return res;
  }


  getById(id) {
    return new Promise(async (resolve) => {
      let cheker = null;

      cheker = setInterval(() => {
        console.log("this.spaceReady", this.spaceReady);

        if (this.spaceReady) {
          getData();
          clearInterval(cheker);
        }
      }, 500);

      const getData = async () => {
        let grant = await this.space.public.get(id);
        if (grant) {
          resolve(grant)
        } else {
          resolve({
            _id: '',
            name: '',
            description: '',
            images: ['https://firebasestorage.googleapis.com/v0/b/grants-platform.appspot.com/o/grant-content%2F1590246149579_roadie_3_tuner-ccbc4c5.jpg?alt=media'],
            content: ''
          })
        }
      };

    })
  }

  // async openSpace() {
  //   const space = await this.box.openSpace("my-dapp")
  // }

  async getProfile(address: string, options?: GetProfileOptions): Promise<Object> {
    if (!window.web3.isAddress(address.toLowerCase())) {
      throw new Error(`This is not a valid address: ${address}`);
    }
    return await Box.getProfile(address, options);
  }

  async getUserProfile(address: string, options?: GetProfileOptions) {
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
      return res.profile;
    } catch (e) {
      return [];
    }
  }
}
