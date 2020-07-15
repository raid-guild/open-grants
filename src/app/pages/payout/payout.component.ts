import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { ethers, providers, utils } from 'ethers';
import { EthcontractService } from 'src/app/services/ethcontract.service';
import Swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { addressValidator } from 'src/app/common/validators/custom.validators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { async } from '@angular/core/testing';
import { SubgraphService } from 'src/app/services/subgraph.service';
import { AddressZero, Zero } from "ethers/constants";
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss'],
})
export class PayoutComponent implements OnInit {
  toastTitle = "Payout"
  grantAddress: string;
  grantees = [];


  public myForm: FormGroup;

  remainingAllocation: any = 0;
  granteeNotMatch = false;
  maxAmountError = false;
  processing = false;
  grantData: any;

  constructor(
    public modalCtrl: ModalController,
    private toastr: ToastrService,
    private navParams: NavParams,
    private fb: FormBuilder,
    public modalController: ModalController,
    private subgraphService: SubgraphService,
    private ethcontractService: EthcontractService,
  ) {

    this.grantAddress = navParams.get('grantAddress');
    this.grantees = navParams.get('grantees');

    (async () => {
      let response: any = await this.subgraphService.getGrantByAddress(this.grantAddress).toPromise();
      this.grantData = response.data.contract;
      console.log("grantData", this.grantData);
    })();

  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      granteeAddress: new FormControl('', Validators.required),
      amount: new FormControl({ value: null, disabled: true }, Validators.required),
    });

    this.form.granteeAddress.valueChanges
      .subscribe(async (val: string) => {
        if (!this.form.granteeAddress.invalid) {
          let temp = await this.ethcontractService.remainingAllocation(this.grantAddress, this.form.granteeAddress.value);
          this.remainingAllocation = +this.currencyCovert(this.grantData.currency, temp);
          this.form.amount.setValidators([Validators.required, Validators.max(this.remainingAllocation), Validators.min(1)]);
          this.myForm.get('amount').enable();
        } else {
          this.myForm.get('amount').reset();
          this.myForm.get('amount').disable();
        }
      });

    // this.form.amount.valueChanges
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(async (val: string) => {
    //     if (this.form.amount.value > this.remainingAllocation) {
    //       this.maxAmountError = true;
    //     } else {
    //       this.maxAmountError = false;
    //     }
    //   });
  }

  get form() {
    return this.myForm.controls;
  }

  currencyCovert(currencyType, amount) {
    if (currencyType == AddressZero) {
      return ethers.utils.formatEther(amount);
    }
    return amount;
  }

  onSubmit() {
    if (this.form.amount.invalid || this.form.granteeAddress.invalid) {
      return
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      backdrop: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then(async (result) => {
      if (result.value) {

        let amount: any = this.form.amount.value;
        if (this.grantData.currency == AddressZero) {
          amount = (ethers.utils.parseEther(this.form.amount.value.toString())).toString();
        }

        const modal = await this.modalController.create({
          component: PopupComponent,
          cssClass: 'custom-modal-style',
          mode: "ios",
          componentProps: {
            modelType: "payout",
            data: { grantAddress: this.grantAddress, grantee: this.form.granteeAddress.value, amount: amount }
          }
        });

        modal.onDidDismiss()
          .then((data: any) => {
            data = data.data;
            console.log("data", data);
            if (data && data.hasOwnProperty('reload') && data.reload) {
              console.log("data", data);
            }
          });

        return await modal.present();
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
  }
}
