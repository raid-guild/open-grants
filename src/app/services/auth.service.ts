import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { AppSettings } from '../config/app.config';
import { Web3Service } from './web3.service';
import { utils } from 'ethers';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedIn = new BehaviorSubject(false);

    constructor(
        public web3service: Web3Service,
    ) { }

    async isAuthenticated(): Promise<boolean> {
        return this.web3service.checkLogin();
    }

    setLoggedIn() {
        this.isLoggedIn.next(true);
    }

    setLoggedOut() {
        this.isLoggedIn.next(false);
    }

    getLoggedIn() {
        return this.isLoggedIn;
    }

    async getAuthUserId() {
        return await this.web3service.getAddress();
    }

    async login() {
        await this.web3service.setProvider();
        const provider = this.web3service.getProvider();
        const address = await (provider.getSigner()).getAddress();
        if (!address) {
          throw new Error('failed to connect to metamask');
        }
        this.setLoggedIn();
    }

    logout() {
        this.setLoggedOut();
    }

}
