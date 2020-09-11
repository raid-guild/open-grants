import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EthContractService } from '../../services/ethcontract.service';
import * as moment from 'moment';
import { utils } from 'ethers';
import { addressValidator } from '../../common/validators/custom.validators';
import { PopupComponent } from '../popup/popup.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-new-grant',
  templateUrl: './create-new-grant.component.html',
  styleUrls: ['./create-new-grant.component.scss'],
})
export class CreateNewGrantComponent implements OnInit {
  processing = false;
  submitted = false;
  toastTitle = 'Grant';
  userData: any;
  grantForm: any;
  minYear: any;
  maxYear: any;
  minCompletionData: any;
  maxCompletionDate: any;
  managerAddressError = false;
  granteeAddressError = [];
  currency = [];
  totalPercentage = 0;
  isAllocationByPer = new FormControl(true);

  percentage: Observable<number>;

  public myForm: FormGroup;

  constructor(
    public modalController: ModalController,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private ethcontractService: EthContractService,
  ) {
    this.bindModel();

    // Min max data form.
    const currentDate = new Date();
    this.maxYear = moment(currentDate).add(100, 'years').format('YYYY-MM-DD');
    this.minYear = moment(currentDate).add(1, 'days').format('YYYY-MM-DD');
  }

  ngOnInit() {
    this.currency = environment.currencies;

    this.granteeControls.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(async (val: string) => {
        this.totalPercentage = 0;
        this.grantee.map(data => {
          this.totalPercentage += +data.controls.allocationPercentage.value;
        });
        this.checkAddress();
      });

    this.form.manager.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(async (val: string) => {
        this.checkAddress();
      });

    this.singleDeliveryControls.controls.fundingExpiryDate.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(async (val: string) => {
        this.singleDeliveryControls.controls.completionDate.reset();
        this.singleDeliveryControls.controls.completionDate.setValue(
          moment(val).add(1, 'days').format(''),
        );
        this.minCompletionData = moment(val).add(1, 'days').format('');
      });
  }

  bindModel() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      uri: ['', Validators.required],
      description: [''],
      images: this.fb.array([]),
      manager: ['', [Validators.required, addressValidator]],
      type: ['singleDeliveryDate', Validators.required],
      targetFunding: [null, [Validators.required, Validators.min(1)]],
      currency: ['', Validators.required],
      content: [''],
      singleDeliveryDate: this.fb.group({
        fundingExpiryDate: ['', Validators.required],
        completionDate: ['', Validators.required],
      }),
      multipleMilestones: this.fb.array([this.initMilestonesFields()]),
      grantees: this.fb.array([this.initGranteesFields()]),
    });
  }

  get form() {
    return this.myForm.controls;
  }

  // singleDelivery
  get singleDelivery() {
    const formGroup = this.myForm.get('singleDeliveryDate') as FormGroup;
    return formGroup.controls;
  }

  get singleDeliveryControls() {
    const formGroup = this.myForm.get('singleDeliveryDate') as FormGroup;
    return formGroup;
  }

  // multiple Milestone
  get multipleMilestones(): any {
    const formArray = this.myForm.get('multipleMilestones') as FormArray;
    return formArray.controls;
  }

  get multipleMilestonesControls() {
    const formArray = this.myForm.get('multipleMilestones') as FormArray;
    return formArray;
  }

  get grantee(): any {
    const formArray = this.myForm.get('grantees') as FormArray;
    return formArray.controls;
  }

  get granteeControls(): any {
    const formArray = this.myForm.get('grantees') as FormArray;
    return formArray;
  }

  initMilestonesFields(): FormGroup {
    return this.fb.group({
      milestoneNumber: new FormControl(null, Validators.required),
      completionDate: new FormControl(null, Validators.required),
    });
  }

  initGranteesFields() {
    this.granteeAddressError.push(false);
    return this.fb.group({
      grantee: new FormControl('', [Validators.required, addressValidator]),
      allocationAmount: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
      allocationPercentage: new FormControl(null, [Validators.required]),
    });
  }

  addNewGrantee() {
    const control = this.myForm.controls.grantees as FormArray;
    control.push(this.initGranteesFields());
  }

  removeGrantee(index: number) {
    const control = this.myForm.controls.grantees as FormArray;
    control.removeAt(index);
    this.granteeAddressError.splice(index, 1);
  }

  setradio(e: string): void {
    this.form.type.setValue(e);
  }

  isSelected(name: string): boolean {
    if (!this.form.type.value) {
      return false;
    }
    return this.form.type.value === name;
  }

  onPercentageChange(index: number) {
    if (this.isAllocationByPer.value) {
      if (this.isAllocationByPer.value) {
        const temp =
          (this.grantee[index].controls.allocationPercentage.value *
            this.form.targetFunding.value) /
          100;
        this.grantee[index].controls.allocationAmount.setValue(temp);
      }
    }
  }

  onPercentageFocus(index: number) {
    if (this.isAllocationByPer.value) {
      let totalPer = 0;
      this.grantee.map((data, i) => {
        if (index !== i) {
          totalPer += +data.controls.allocationPercentage.value;
        }
      });
      this.grantee[index].controls.allocationPercentage.setValidators([
        Validators.required,
        Validators.max(100 - totalPer),
        Validators.min(0.000001),
      ]);
    }
  }

  onAmountChange(index: number) {
    if (!this.isAllocationByPer.value) {
      const temp =
        (this.grantee[index].controls.allocationAmount.value * 100) /
        this.form.targetFunding.value;
      if (
        this.form.targetFunding.value <= 0 ||
        this.form.targetFunding.value == null
      ) {
        this.grantee[index].controls.allocationPercentage.setValue(0);
      } else {
        this.grantee[index].controls.allocationPercentage.setValue(temp);
      }

      let remainingAmount = 0;
      this.grantee.map((data, i) => {
        if (index !== i) {
          remainingAmount += +data.controls.allocationAmount.value;
        }
      });

      this.grantee[index].controls.allocationAmount.setValidators([
        Validators.required,
        Validators.max(this.form.targetFunding.value - remainingAmount),
        Validators.min(1),
      ]);

      this.grantee[index].controls.allocationAmount.setValue(
        this.grantee[index].controls.allocationAmount.value,
      );
    }
  }

  targetFundingChange() {
    if (this.isAllocationByPer.value) {
      this.grantee.map(data => {
        const temp =
          (data.controls.allocationPercentage.value *
            this.form.targetFunding.value) /
          100;
        data.controls.allocationAmount.setValue(temp);
      });
    } else {
      let totalAllocated = 0;
      this.grantee.map((data, index) => {
        const temp =
          (data.controls.allocationAmount.value * 100) /
          this.form.targetFunding.value;
        if (
          this.form.targetFunding.value <= 0 ||
          this.form.targetFunding.value == null
        ) {
          data.controls.allocationPercentage.setValue(0);
        } else {
          data.controls.allocationPercentage.setValue(temp);
        }

        totalAllocated += +data.controls.allocationAmount.value;
        if (totalAllocated > this.form.targetFunding.value) {
          this.onAmountFocus(index);
        } else {
          this.grantee[index].controls.allocationAmount.setValidators([
            Validators.required,
            Validators.min(1),
          ]);
          this.grantee[index].controls.allocationAmount.setValue(
            this.grantee[index].controls.allocationAmount.value,
          );
        }
      });
    }
  }

  onAmountFocus(index: number) {
    if (!this.isAllocationByPer.value) {
      let remainingAmount = 0;
      this.grantee.map((data, i) => {
        if (index !== i) {
          remainingAmount += +data.controls.allocationAmount.value;
        }
      });

      this.grantee[index].controls.allocationAmount.setValidators([
        Validators.required,
        Validators.max(this.form.targetFunding.value - remainingAmount),
        Validators.min(1),
      ]);

      this.grantee[index].controls.allocationAmount.setValue(
        this.grantee[index].controls.allocationAmount.value,
      );
    }
  }

  checkAddress() {
    let valid = true;
    this.managerAddressError = false;
    this.myForm.controls.grantees.value.map((map1, index) => {
      this.granteeAddressError[index] = false;
      if (
        map1.grantee.toLowerCase() ===
        this.myForm.controls.manager.value.toLowerCase()
      ) {
        this.managerAddressError = true;
        this.granteeAddressError[index] = true;
        valid = false;
      }

      this.myForm.controls.grantees.value.map((map2, i) => {
        if (
          map1.grantee.toLowerCase() === map2.grantee.toLowerCase() &&
          index !== i
        ) {
          this.granteeAddressError[index] = true;
          this.granteeAddressError[i] = true;
          valid = false;
        }
      });
    });

    return valid;
  }

  arrangeData() {
    return new Promise(async resolve => {
      try {
        // Milliseconds to seconds.
        const fundingExpiration = moment(
          this.grantForm.singleDeliveryDate.fundingExpiryDate,
        ).unix();
        const contractExpiration = moment(
          this.grantForm.singleDeliveryDate.completionDate,
        ).unix();

        const data = {
          uri: this.grantForm.uri,
          grantees: this.grantForm.grantees.map(d => d.grantee),
          amounts: this.grantForm.grantees.map(d => d.allocationAmount),
          manager: this.grantForm.manager,
          currency: this.grantForm.currency,
          targetFunding: this.grantForm.targetFunding,
          fundingExpiration,
          contractExpiration,
        };

        resolve(data);
      } catch (e) {
        resolve();
      }
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (
      this.myForm.controls.targetFunding.invalid ||
      this.myForm.controls.currency.invalid ||
      this.myForm.controls.singleDeliveryDate.invalid ||
      this.myForm.controls.manager.invalid ||
      this.myForm.controls.grantees.invalid
    ) {
      return;
    }

    if (!this.checkAddress()) {
      return;
    }

    this.grantForm = JSON.parse(JSON.stringify(this.myForm.value));

    this.grantForm.grantees = this.grantForm.grantees.map(data => {
      delete data.allocationPercentage;
      return JSON.parse(JSON.stringify(data));
    });

    const contractData = await this.arrangeData();

    if (contractData) {
      const modal = await this.modalController.create({
        component: PopupComponent,
        cssClass: 'custom-modal-style',
        mode: 'ios',
        componentProps: {
          modelType: 'deployContract',
          data: contractData,
        },
      });

      modal.onDidDismiss().then((data: any) => {
        if (data && data.hasOwnProperty('redirect') && data.redirect) {
          this.router.navigate(['/pages/latest']);
        }
      });

      return await modal.present();
    }
  }
}
