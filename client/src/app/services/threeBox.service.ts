import { Inject, Injectable } from '@angular/core';
import Web3 from 'web3';
import { BehaviorSubject } from 'rxjs';
// const Box = require('3box');
import * as Box from '3box';
import { AppSettings } from '../config/app.config';
import { async } from '@angular/core/testing';
import { id } from 'ethers/utils';

declare let window: any;

@Injectable()
export class ThreeBoxService {
  box: any;
  space: any;
  thread: any;
  posts: any;
  user: any;
  constructor() {
    this.user = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
  }

  async getProfile() {
    await window.ethereum.enable()

    // this.box = await Box.openBox(window.web3.eth.coinbase, window.ethereum);
    // console.log("box", this.box);

    // this.space = await this.box.openSpace('grant-platform');
    // console.log("space", this.space);

    // this.thread = await this.space.joinThread("my-grant");
    // console.log("thread", this.thread);

    // this.getAppsThread()

    const profile = await Box.getProfile(window.web3.eth.coinbase)

    const query = `{ 
      profile(id: "${window.web3.eth.coinbase}" ) {
        image
        name
        emoji
        location
      } 
    }`

    // try {
      let res = await Box.profileGraphQL(query)
      return res.profile
    // } catch (e) {
    //   return []
    // }
  }

  async getAppsThread() {
    if (!this.thread) {
      console.error("apps thread not in state");
      return;
    }

    this.posts = await this.thread.getPosts();
    console.log("posts", this.posts);
    await this.thread.onUpdate(async () => {
      this.posts = await this.thread.getPosts();
      console.log("posts", this.posts);
    })
  }

}
