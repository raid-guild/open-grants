import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { AppSettings } from 'src/app/config/app.config';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';
import { EthcontractService } from 'src/app/services/ethcontract.service';
import { Subscription } from 'rxjs';
import { ThreeBoxService } from 'src/app/services/threeBox.service';
declare let window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userEthAddress: any;
  user3BoxProfile: any;
  toastTitle = "User";
  profile: File;
  balance: any;
  account: any;
  isPicture = false;
  accInfoSubscription: Subscription;

  constructor(
    private userManagementService: UserManagementService,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private toastr: ToastrService,
    private ethcontractService: EthcontractService,
    private _zone: NgZone,
    private threeBoxService: ThreeBoxService
  ) {
    this.userEthAddress = localStorage.getItem(AppSettings.localStorage_keys.userEthAddress);
    this.getAccountInfo();
  }

  ngOnInit() {
  }

  async getAccountInfo() {
    if (this.userEthAddress) {
      this.user3BoxProfile = await this.threeBoxService.getUserProfile(this.userEthAddress);
      if (this.user3BoxProfile && this.user3BoxProfile.hasOwnProperty('image') && this.user3BoxProfile.image) {
        this.isPicture = true;
      }

      let data: any = await this.ethcontractService.getAccountInfo(this.userEthAddress);
      this.account = data.account;
      this.balance = data.balance;
    }

    // this.ethcontractService.acctInfo.subscribe((data) => {
    //   this._zone.run(() => {
    //     this.account = data.account;
    //     this.balance = data.balance;
    //     console.log("acctInfo", data)
    //   });
    // })
  }

  ngOnDestroy() {
  }
}
