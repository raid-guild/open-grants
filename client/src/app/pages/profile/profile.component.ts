import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { AppSettings } from 'src/app/config/app.config';
import { UserService } from 'src/app/services/user.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ImageCropComponent } from '../image-crop/image-crop.component';
import { EthcontractService } from 'src/app/services/ethcontract.service';
import { Subscription } from 'rxjs';
import { PublicKeyModelComponent } from '../public-key-model/public-key-model.component';

declare let window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userData: any;
  toastTitle = "User";
  profile: File;
  balance: any;
  account: any;
  isPicture = false;
  accInfoSubscription: Subscription;

  constructor(
    private userManagementService: UserManagementService,
    public popoverCtrl: PopoverController,
    private userService: UserService,
    public modalController: ModalController,
    private toastr: ToastrService,
    private ethcontractService: EthcontractService,
    private _zone: NgZone,
  ) {
    this.getUserData();

    // (async () => {
    // })();

    // this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
  }

  ngOnInit() {

  }

  async userMenuPopover($event) {
    const popover = await this.popoverCtrl.create({
      component: MenuPopoverComponent,
      event: event,
      translucent: true,
      cssClass: 'poopover-user-option'
    })

    return await popover.present();
  }

  async resetPassword(data: any) {
    const modal = await this.modalController.create({
      component: ResetPasswordComponent,
      cssClass: 'custom-modal-style',
      mode: "ios",
    });
    return await modal.present();
  }

  async changePublicKey() {
    const modal = await this.modalController.create({
      component: PublicKeyModelComponent,
      cssClass: 'custom-modal-style',
      mode: "ios",
      componentProps: {
        isAvailable: true
      }
    });
    return await modal.present();
  }

  getUserData() {
    // this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
    this.userService.getUser().subscribe((res: HTTPRESPONSE) => {
      this.userData = res.data;
      if (this.userData && this.userData.hasOwnProperty('picture') && this.userData.picture) {
        this.isPicture = true;
      }

      console.log()
      this.getAccountInfo();
    });
  }

  async getAccountInfo() {
    if (this.userData && this.userData.hasOwnProperty('publicKey') && this.userData.publicKey) {
      let data: any = await this.ethcontractService.getAccountInfo(this.userData.publicKey);
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

  async imageCrop(data: any) {
    console.log("data", data);
    const modal = await this.modalController.create({
      component: ImageCropComponent,
      cssClass: 'custom-modal-style',
      mode: "ios",
      componentProps: {
        imageData: data
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        const userData = data['data'];
        if (userData) {
          console.log("userData", userData)
          this.userData = userData;
          if (this.userData && this.userData.hasOwnProperty('picture') && this.userData.picture) {
            this.isPicture = true;
          }
        }
      });

    return await modal.present();
  }

  fileChangeEvent(event: any): void {
    this.imageCrop(event);
  }

  ngOnDestroy() {
  }
}
