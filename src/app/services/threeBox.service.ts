import { Inject, Injectable } from '@angular/core';
import Web3 from 'web3';
import { BehaviorSubject } from 'rxjs';
import { BoxOptions, GetProfileOptions, Threebox } from './3box';
import { AppSettings } from '../config/app.config';
import { async } from '@angular/core/testing';
import { id } from 'ethers/utils';
// import * as ThreeboxFactory from '3box';
// const ThreeboxFactory = require('3box');
// const { profileGraphQL, getProfile, getProfiles, getVerifiedAccounts } = require('3box/lib/api')

declare let window: any;

@Injectable({ providedIn: 'root' })
export class ThreeBoxService {
  // box: any;
  space: any;
  thread: any;
  posts: any;

  private _box = new BehaviorSubject<Threebox>(null);
  public box$ = this._box.asObservable();

  constructor() { }

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

  async getProfile(address: string, options?: GetProfileOptions) {
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

    // try {
    //   let res = await profileGraphQL(query);
    //   return res.profile;

    // } catch (e) {
    //   return [];
    // }

    return [];
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