import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { EthContractService } from 'src/app/services/ethcontract.service';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  modelType: string;
  data: any;
  logingIn = false;
  loginSuccess = false;
  loginError = false;

  deploying = false;
  deploySuccess = false;
  deployError = false;

  canceling = false;
  canceledSuccess = false;
  canceledFail = false;

  funding = false;
  fundingSuccess = false;
  fundingError = false;

  payouting = false;
  payoutSuccess = false;
  payoutError = false;

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private authService: AuthService,
    private ethcontractService: EthContractService,
    private web3service: Web3Service,
  ) {
    this.modelType = this.navParams.get('modelType');
    this.data = this.navParams.get('data');
  }

  ngOnInit() {
    if (this.modelType === 'login') {
      this.login();
    }

    if (this.modelType === 'deployContract') {
      this.deployContract();
    }

    if (this.modelType === 'cancelContract') {
      this.cancelContract();
    }

    if (this.modelType === 'fundingContract') {
      this.fundingContract();
    }

    if (this.modelType === 'payout') {
      this.contractPayout();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async login() {
    try {
      this.logingIn = true;
      await this.authService.login();

      this.loginSuccess = true;
      this.logingIn = false;

      setTimeout(() => {
        this.dismiss();
      }, 2000);
    } catch (e) {
      this.logingIn = false;
      this.loginError = true;
    }
  }

  async deployContract() {
    try {
      this.deploying = true;
      const contract: any = await this.ethcontractService.createGrant(
        this.data,
      );

      if (contract.status === 'success') {
        this.deploying = false;
        this.deploySuccess = true;

        setTimeout(() => {
          this.modalCtrl.dismiss({ redirect: true });
        }, 2000);
      } else {
        this.deploying = false;
        this.deployError = true;
      }
    } catch (e) {
      this.deploying = false;
      this.deployError = true;
    }
  }

  async cancelContract() {
    this.canceling = true;
    const contract: any = await this.ethcontractService.cancelGrant(this.data);

    if (contract.status == 'success') {
      this.canceling = false;
      this.canceledSuccess = true;

      setTimeout(() => {
        this.modalCtrl.dismiss({ reload: true });
      }, 2000);
    } else {
      this.canceling = false;
      this.canceledFail = true;
    }
  }

  async fundingContract() {
    this.funding = true;
    const funding: any = await this.ethcontractService.fund(
      this.data.grantAddress,
      this.data.amount,
    );

    if (funding.status == 'success') {
      this.funding = false;
      this.fundingSuccess = true;

      setTimeout(() => {
        this.modalCtrl.dismiss({ reload: true });
      }, 2000);
    } else {
      this.funding = false;
      this.fundingError = true;
    }
  }

  async contractPayout() {
    this.payouting = true;
    const payoutRes: any = await this.ethcontractService.approvePayout(
      this.data.grantAddress,
      this.data.grantee,
      this.data.amount,
    );

    if (payoutRes.status == 'success') {
      this.payouting = false;
      this.payoutSuccess = true;

      setTimeout(() => {
        this.modalCtrl.dismiss({ reload: true });
      }, 2000);
    } else {
      this.payouting = false;
      this.payoutError = true;
    }
  }
}
