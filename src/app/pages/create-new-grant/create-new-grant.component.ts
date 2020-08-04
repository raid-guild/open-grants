import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { Subscription, Observable, of } from 'rxjs';
import { FormControl, FormGroup, Validators, FormBuilder, Form, FormArray, AbstractControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AppSettings } from 'src/app/config/app.config';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { EthcontractService } from '../../services/ethcontract.service';
import { UtilsService } from '../../services/utils.service';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { async } from '@angular/core/testing';
import { ethers, providers, utils } from 'ethers';
import * as Web3 from 'web3';
import { addressValidator } from '../../common/validators/custom.validators';
import { ImageUploadComponent, FileHolder } from 'angular2-image-upload';
import { PopupComponent } from '../popup/popup.component';
import { resolve } from 'url';

declare let window: any;

@Component({
  selector: 'app-create-new-grant',
  templateUrl: './create-new-grant.component.html',
  styleUrls: ['./create-new-grant.component.scss'],
})

export class CreateNewGrantComponent implements OnInit {

  @ViewChild(ImageUploadComponent, { static: false }) imageUpload: ImageUploadComponent;

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
  totalPercentage = 0
  isAllocationByPer = new FormControl(true)

  tinymceInit: any;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  videoExtention = [".3gp", ".mp4", ".webm", ".flv", ".avi", ".HDV", ".mkv"]

  public myForm: FormGroup;

  constructor(
    public modalController: ModalController,
    private angularFireStorage: AngularFireStorage,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private ethcontractService: EthcontractService,
    private utilsService: UtilsService
  ) {

    this.bindModel();
    let curruntDate = new Date();
    this.maxYear = curruntDate.getFullYear() + 100;
    this.minYear = moment(curruntDate).add(1, 'days').format('YYYY-MM-DD')
  }

  ngOnInit() {
    this.currency = [
      { name: "ETH", value: "ETH" }
    ]

    this.granteeControls.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(async (val: string) => {
        this.totalPercentage = 0;
        this.grantee.map((data) => {
          this.totalPercentage += +data.controls.allocationPercentage.value;
        });
        this.checkAddress()
      });

    this.form.manager.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(async (val: string) => {
        this.checkAddress()
      });

    this.singleDeliveryControles.controls.fundingExpiryDate.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(async (val: string) => {
        this.singleDeliveryControles.controls.completionDate.reset();
        this.singleDeliveryControles.controls.completionDate.setValue(moment(val).add(1, 'days').format(''));
        this.minCompletionData = moment(val).add(1, 'days').format('');
      });

    this.tinymceInit = {
      selector: 'textarea',
      height: 470,
      menubar: true,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks advcode fullscreen',
        'insertdatetime media table contextmenu powerpaste',
        'quickbars',
        'codesample',
        'code',
        'help',
      ],
      toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code',
      powerpaste_allow_local_images: true,
      powerpaste_word_import: 'prompt',
      powerpaste_html_import: 'prompt',
      // font_formats: 'Arial=arial;Helvetica=helvetica;Sans-serif=sans-serif;Courier=courier;Courier New=courier new;Courier Prime=courier prime;Monospace=monospace;AkrutiKndPadmini=Akpdmi-n',
      quickbars_insert_toolbar: 'quicktable image media codesample',
      quickbars_selection_toolbar: 'bold italic underline | formatselect | blockquote quicklink',
      contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
      image_advtab: true,

      file_picker_callback: (cb, value, meta) => {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '*/*');

        input.onchange = () => {
          var file = input.files[0];

          // if (file && file.size > 10000000) {
          //   this.toastr.error("media size !!");
          // }

          const folder = "grant-content";
          const fileName = `${new Date().getTime()}_${file.name}`;
          const path = folder + '/' + fileName;
          let downloadURL;
          this.angularFireStorage.upload(path, file)
            .then((snapshot) => {
              if (snapshot.state = "success") {
                downloadURL = 'https://firebasestorage.googleapis.com/v0/b/' + AppSettings.firebaseConfig.storageBucket + '/o/' + folder + '%2F' + fileName + '?alt=media';

                cb(downloadURL, { title: file.name });
              }
            }, (error) => {
              this.toastr.error("Some thing went wrong !!");
            });
        };
        input.click();
      },

      images_upload_handler: (blobInfo, success, failure) => {
        var file = blobInfo.blob();
        const folder = "grant-content";
        const fileName = `${new Date().getTime()}_${blobInfo.filename()}`;
        const path = folder + '/' + fileName;
        let downloadURL;
        this.angularFireStorage.upload(path, file)
          .then((snapshot) => {
            if (snapshot.state = "success") {
              downloadURL = 'https://firebasestorage.googleapis.com/v0/b/' + AppSettings.firebaseConfig.storageBucket + '/o/' + folder + '%2F' + fileName + '?alt=media';

              success(downloadURL);
            }
          }, (error) => {
            this.toastr.error("Some thing went wrong !!");
            failure();
          });
      },

      media_url_resolver: (data, resolve/*, reject*/) => {
        var embedHtml;
        this.videoExtention.map((extention) => {
          if (data.url.indexOf(extention) !== -1) {

            embedHtml = '<iframe src="' + data.url +
              '" width="400" height="400" ></iframe>';
          }
        });

        if (embedHtml) {
          resolve({ html: embedHtml });
        } else {
          resolve({ html: '' });
        }
      }
    };

  }

  bindModel() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
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
      multipleMilestones: this.fb.array([
        this.initMilestonesFields()
      ]),
      grantees: this.fb.array([
        this.initGranteesFields()
      ]),
    })

  }

  get form() {
    return this.myForm.controls;
  }

  // singleDelivery
  get singleDelivery() {
    const formGroup = this.myForm.get('singleDeliveryDate') as FormGroup;
    return formGroup.controls
  }

  get singleDeliveryControles() {
    const formGroup = this.myForm.get('singleDeliveryDate') as FormGroup;
    return formGroup
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
      completionDate: new FormControl(null, Validators.required)
    });
  }


  addNewMilestone() {
    const control = <FormArray>this.myForm.controls.multipleMilestones;
    control.push(this.initMilestonesFields());
  }

  removeMilestone(index: number) {
    const control = <FormArray>this.myForm.controls.multipleMilestones;
    control.removeAt(index);
  }

  initGranteesFields() {
    this.granteeAddressError.push(false)
    return this.fb.group({
      grantee: new FormControl('', [Validators.required, addressValidator]),
      allocationAmount: new FormControl(null, [Validators.required, Validators.min(1)]),
      allocationPercentage: new FormControl(null, [Validators.required]),
    });
  }

  addNewGrantee() {
    const control = <FormArray>this.myForm.controls.grantees;
    control.push(this.initGranteesFields());
  }

  removeGrantee(index: number) {
    const control = <FormArray>this.myForm.controls.grantees;
    control.removeAt(index);
    this.granteeAddressError.splice(index, 1)
  }

  setradio(e: string): void {
    this.form.type.setValue(e);
  }

  isSelected(name: string): boolean {
    if (!this.form.type.value) {
      return false;
    }
    return (this.form.type.value === name);
  }

  onPercentageChange(index: number) {
    if (this.isAllocationByPer.value) {
      if (this.isAllocationByPer.value) {
        let temp = (this.grantee[index].controls.allocationPercentage.value * this.form.targetFunding.value) / 100;
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
      })
      this.grantee[index].controls.allocationPercentage.setValidators([Validators.required, Validators.max(100 - totalPer), Validators.min(0.000001)]);
    }
  }

  onAmountChange(index: number) {
    if (!this.isAllocationByPer.value) {
      let temp = (this.grantee[index].controls.allocationAmount.value * 100) / this.form.targetFunding.value;
      if (this.form.targetFunding.value <= 0 || this.form.targetFunding.value == null) {
        this.grantee[index].controls.allocationPercentage.setValue(0);
      } else {
        this.grantee[index].controls.allocationPercentage.setValue(temp);
      }

      let remainingAmount = 0;
      this.grantee.map((data, i) => {
        if (index !== i) {
          remainingAmount += +data.controls.allocationAmount.value;
        }
      })

      this.grantee[index].controls.allocationAmount.setValidators([Validators.required, Validators.max(this.form.targetFunding.value - remainingAmount), Validators.min(1)]);
      this.grantee[index].controls.allocationAmount.setValue(this.grantee[index].controls.allocationAmount.value);

    }
  }

  targetFundingChange() {
    if (this.isAllocationByPer.value) {
      this.grantee.map((data) => {
        let temp = (data.controls.allocationPercentage.value * this.form.targetFunding.value) / 100;
        data.controls.allocationAmount.setValue(temp);
      })
    } else {
      let totalAllocated = 0;
      this.grantee.map((data, index) => {

        let temp = (data.controls.allocationAmount.value * 100) / this.form.targetFunding.value;
        if (this.form.targetFunding.value <= 0 || this.form.targetFunding.value == null) {
          data.controls.allocationPercentage.setValue(0);
        } else {
          data.controls.allocationPercentage.setValue(temp);
        }

        totalAllocated += +data.controls.allocationAmount.value;
        if (totalAllocated > this.form.targetFunding.value) {
          this.onAmountFocus(index);
        } else {
          this.grantee[index].controls.allocationAmount.setValidators([Validators.required, Validators.min(1)]);
          this.grantee[index].controls.allocationAmount.setValue(this.grantee[index].controls.allocationAmount.value);
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
      })

      this.grantee[index].controls.allocationAmount.setValidators([Validators.required, Validators.max(this.form.targetFunding.value - remainingAmount), Validators.min(1)]);
      this.grantee[index].controls.allocationAmount.setValue(this.grantee[index].controls.allocationAmount.value);
    }
  }

  checkAddress() {
    let valid = true
    this.managerAddressError = false;
    this.myForm.controls.grantees.value.map((map1, index) => {
      this.granteeAddressError[index] = false;
      if (map1.grantee.toLowerCase() == this.myForm.controls.manager.value.toLowerCase()) {
        this.managerAddressError = true;
        this.granteeAddressError[index] = true
        valid = false
      }

      this.myForm.controls.grantees.value.map((map2, i) => {
        if (map1.grantee.toLowerCase() == map2.grantee.toLowerCase() && index != i) {
          this.granteeAddressError[index] = true
          this.granteeAddressError[i] = true
          valid = false
        }
      })
    });

    return valid;
  }

  arrangeData() {
    return new Promise(async (resolve) => {
      try {

        let fundingExpiration, contractExpiration;

        if (this.grantForm.type == "singleDeliveryDate") {
          fundingExpiration = new Date(this.grantForm.singleDeliveryDate.fundingExpiryDate).getTime();
          contractExpiration = new Date(this.grantForm.singleDeliveryDate.completionDate).getTime();

          // console.log('fundingExpiration', fundingExpiration, moment(fundingExpiration).format());
          // console.log('contractExpiration', contractExpiration, moment(contractExpiration).format());

        } else {
          // console.log("this.grantForm.multipleMilestones", this.grantForm.multipleMilestones[this.grantForm.multipleMilestones.length - 1].completionDate);
          fundingExpiration = new Date(this.grantForm.multipleMilestones[this.grantForm.multipleMilestones.length - 1].completionDate).getTime();
          let temp = moment(this.grantForm.multipleMilestones[this.grantForm.multipleMilestones.length - 1].completionDate).add(1, 'days').format();
          contractExpiration = new Date(temp).getTime();

        }

        let data = {
          uri: utils.formatBytes32String(this.utilsService.generateUUID()),
          grantees: this.grantForm.grantees.map((data) => { return data.grantee }),
          amounts: this.grantForm.grantees.map((data) => { return data.allocationAmount }),
          manager: this.grantForm.manager,
          currency: this.grantForm.currency,
          targetFunding: this.grantForm.targetFunding,
          fundingExpiration: fundingExpiration,
          contractExpiration: contractExpiration
        }

        resolve(data);
        // }
        // resolve();
      } catch (e) {
        resolve();
      }
    })
  }

  async onSubmit() {
    this.submitted = true;
    if (this.myForm.controls.type.value == "singleDeliveryDate") {
      if (this.myForm.controls.targetFunding.invalid || this.myForm.controls.currency.invalid || this.myForm.controls.singleDeliveryDate.invalid
        || this.myForm.controls.manager.invalid || this.myForm.controls.grantees.invalid) {
        return
      }
    } else {
      if (this.myForm.controls.targetFunding.invalid || this.myForm.controls.currency.invalid || this.myForm.controls.multipleMilestones.invalid
        || this.myForm.controls.manager.invalid || this.myForm.controls.grantees.invalid || !this.imageUpload.files.length) {
        return
      }
    }

    if (!this.checkAddress()) {
      return
    };

    this.grantForm = JSON.parse(JSON.stringify(this.myForm.value));
    // console.log("this.grantForm", this.grantForm);

    // for (let i = 0; i < this.imageUpload.files.length; i++) {
    //   try {
    //     let imageURL = await this.utils.fileToBase64(this.imageUpload.files[i].file)
    //     if (imageURL.status) {
    //       this.grantForm.images.push(imageURL.data)
    //     }
    //   } catch (e) { }
    // }

    this.grantForm.grantees = this.grantForm.grantees.map((data) => {
      delete data.allocationPercentage
      return JSON.parse(JSON.stringify(data));
    })

    // this.grantForm.content = this.grantForm.content.replace(/"/g, "&quot;");
    let contractData = await this.arrangeData();

    if (contractData) {
      const modal = await this.modalController.create({
        component: PopupComponent,
        cssClass: 'custom-modal-style',
        mode: "ios",
        componentProps: {
          modelType: "deployContract",
          data: contractData
        }
      });

      modal.onDidDismiss()
        .then((data: any) => {
          if (data && data.hasOwnProperty('redirect') && data.redirect) {
            this.router.navigate(['/pages/latest']);
          }
        });

      return await modal.present();
    }
  }
}