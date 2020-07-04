import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { UserManagementService } from 'src/app/services/user-management.service';
import { AuthService } from 'src/app/services/auth.service';
import { AppSettings } from 'src/app/config/app.config';

declare let window: any;

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  loging = false;
  loginSuccess = false;
  loginError = false;

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private authService: AuthService,
    private userManagementService: UserManagementService
  ) { }

  ngOnInit() { }

  dismiss() {
    this.modalCtrl.dismiss()
  }

  async login() {
    try {
      this.loging = true;
      let nouce = Math.floor(Math.random() * 1000000);
      let userEthAddress = window.web3.currentProvider
      let signMessage: any = await this.handleSignMessage(userEthAddress, nouce)
      this.userManagementService.setUserEthAddress(userEthAddress);
      localStorage.setItem(AppSettings.localStorage_keys.currentNetwork, "Ropsten");
      localStorage.setItem(AppSettings.localStorage_keys.nouce, nouce.toString());
      localStorage.setItem(AppSettings.localStorage_keys.userSign, JSON.stringify(signMessage));
      this.authService.setAuthState({ is_logged_in: true });

      this.loging = false;
      this.loginSuccess = true;

      setTimeout(() => {
        this.dismiss()
      }, 2000)
    } catch (e) {
      this.loging = false;
      this.loginError = true;
    }
  }

  handleSignMessage(publicAddress, nonce) {
    return new Promise((resolve, reject) => {
      window.web3.personal.sign(
        window.web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) reject(err);
          resolve({ publicAddress, signature });
        }
      )
    })
  }
}
