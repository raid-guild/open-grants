import { Injectable } from '@angular/core';
import { ethers, providers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private provider: providers.Web3Provider;

  constructor() {}

  async setProvider() {
    await window.ethereum.enable();
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    return true;
  }

  getProvider() {
    return this.provider;
  }

  async getNetwork() {
    await this.setProvider();
    return await this.provider.getNetwork();
  }

  async getAddress() {
    await this.setProvider();
    return await this.provider.getSigner().getAddress();
  }

  async checkLogin() {
    let res = false;
    try {
      await this.getAddress();
      res = true;
    } catch (e) {
      console.log('Metamask Login Error: ', e);
    }
    return res;
  }
}
