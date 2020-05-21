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

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss'],
})
export class PayoutComponent implements OnInit {
  toastTitle = "Payout"
  @Input() grantData: any;

  public myForm: FormGroup;

  remainingAllocation: any = 0;
  granteeNotMatch = false
  processing = false;

  constructor(
    public modalCtrl: ModalController,
    private toastr: ToastrService,
    private navParams: NavParams,
    private fb: FormBuilder,
    private ethcontractService: EthcontractService,
  ) {

    this.grantData = navParams.get('grantData');
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      granteeAddress: new FormControl('', [Validators.required, addressValidator]),
      amount: new FormControl({ value: null, disabled: true }, Validators.required),
    });

    this.form.granteeAddress.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(async (val: string) => {
        console.log("grantManager.valueChanges");
        if (!this.form.granteeAddress.invalid) {
          let match = this.grantData.grantees.find(data => data.grantee == val)
          console.log("match", match);
          if (!match) {
            this.granteeNotMatch = true;
            this.myForm.get('amount').reset();
            this.myForm.get('amount').disable();
          } else {
            this.granteeNotMatch = false;
            this.remainingAllocation = await this.ethcontractService.remainingAllocation(this.grantData.contractAddress, this.form.amount.value);
            console.log("this.remainingAllocation", this.remainingAllocation);
            this.myForm.get('amount').enable();
          }
        } else {
          this.myForm.get('amount').reset();
          this.myForm.get('amount').disable();
        }
      });
  }

  get form() {
    return this.myForm.controls;
  }

  onSubmit() {
    if (this.granteeNotMatch) {
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
        try {
          this.processing = true;
          console.log("this.form", this.form);
          let amount = (ethers.utils.parseEther(this.form.amount.value.toString())).toString();
          console.log("amount", amount)
          let approvePayout: any = await this.ethcontractService.approvePayout(this.grantData.contractId, this.form.granteeAddress.value, amount)
          if (approvePayout.status == "success") {
            this.toastr.success(approvePayout.message, this.toastTitle);
          } else {
            this.toastr.error(approvePayout.message, this.toastTitle);
          }
        } catch (e) {
          this.processing = false;
          this.toastr.error('Something went wrong !!', this.toastTitle);
        }
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
  }
}
