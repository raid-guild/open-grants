import { Inject, Injectable } from '@angular/core';
import Web3 from 'web3';
import { BehaviorSubject } from 'rxjs';
import * as Box from '3box';
import { BoxOptions, GetProfileOptions, Threebox } from './3box';
import { AppSettings } from '../config/app.config';
import { async } from '@angular/core/testing';
import { id } from 'ethers/utils';

declare let window: any;
declare let require: any;

@Injectable({ providedIn: 'root' })
export class ThreeBoxService {
  // box: any;
  space: any;
  thread: any;
  posts: any;
  user: any;

  private _box = new BehaviorSubject<Threebox>(null);
  public box$ = this._box.asObservable();

  constructor() {
    (async () => {
      const profile = await Box.getProfile(window.web3.eth.coinbase)
      console.log("profile", profile);
    })();
  }

  public get box(): Threebox {
    return this._box.getValue();
  }

  public set box(box: Threebox) {
    this._box.next(box);
  }

  // public openBox(address?: string, options?: BoxOptions): Promise<Threebox> {
  //   return ThreeboxFactory.openBox(address, window.web3.currentProvider, options
  //   ).then(box => {
  //     this.box = box;
  //     return box;
  //   });
  // }

  // public getProfile(address: string, options?: GetProfileOptions): Promise<Object> {
  //   return ThreeboxFactory.getProfile(address, options);
  // }

  async getUserProfile(address: string, options?: GetProfileOptions) {
    await window.ethereum.enable()
    const profile = await Box.getProfile(window.web3.eth.coinbase)
    console.log("profile", profile);

    const query = `{ 
      profile(id: "${address}" ) {
        image
        name
        emoji
        location
      } 
    }`

    try {
      let res = await Box.profileGraphQL(query)
      return res.profile;
    } catch (e) {
      return [];
    }
  }

  async getAppsThread() {
    // this.box = await Box.openBox(window.web3.eth.coinbase, window.ethereum);
    // console.log("box", this.box);

    // this.space = await this.box.openSpace('grant-platform');
    // console.log("space", this.space);

    // this.thread = await this.space.joinThread("my-grant");
    // console.log("thread", this.thread);

    // if (!this.thread) {
    //   console.error("apps thread not in state");
    //   return;
    // }

    // this.posts = await this.thread.getPosts();
    // console.log("posts", this.posts);
    // await this.thread.onUpdate(async () => {
    //   this.posts = await this.thread.getPosts();
    //   console.log("posts", this.posts);
    // })
  }

}
