import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { AppSettings } from 'src/app/config/app.config';
import { ToastrService } from 'ngx-toastr';
import { EthcontractService } from 'src/app/services/ethcontract.service';
import { Subscription } from 'rxjs';
declare let window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userEthAddress: any;
  toastTitle = "User";
  profile: File;
  balance: any;
  account: any;
  isPicture = false;
  accInfoSubscription: Subscription;

  constructor(
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private toastr: ToastrService,
    private ethcontractService: EthcontractService,
    private _zone: NgZone
  ) {
    this.userEthAddress = localStorage.getItem(AppSettings.localStorage_keys.userEthAddress);
    this.getAccountInfo();
  }

  ngOnInit() {
  }

  async getAccountInfo() {
    if (this.userEthAddress) {

      let data: any = await this.ethcontractService.getAccountInfo(this.userEthAddress);
      this.account = data.account;
      this.balance = data.balance;
    }

  }

  ngOnDestroy() {
  }
}
