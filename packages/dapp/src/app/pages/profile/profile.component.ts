import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { EthContractService } from 'src/app/services/ethcontract.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userEthAddress: any;
  toastTitle = 'User';
  profile: File;
  balance: any;
  account: any;
  isPicture = false;
  accInfoSubscription: Subscription;

  constructor(
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private toastr: ToastrService,
    private ethcontractService: EthContractService,
  ) {}

  ngOnInit() {}

  async getAccountInfo() {}

  ngOnDestroy() {}
}
