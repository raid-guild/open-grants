import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { IGrant, GrantService } from 'src/app/services/grant.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { UserService } from 'src/app/services/user.service';
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

declare let window: any;

@Component({
  selector: 'app-create-new-grant',
  templateUrl: './create-new-grant.component.html',
  styleUrls: ['./create-new-grant.component.scss'],
})

export class CreateNewGrantComponent implements OnInit {

  @ViewChild(ImageUploadComponent, { static: false }) imageUpload: ImageUploadComponent;

  user: any;
  processing = false;
  submitted = false;
  toastTitle = 'Grant';
  userData: any;
  grantForm: any;
  tagInputItems = [];
  managerTagInputItem = [];
  minYear: any;
  maxYear: any;
  minCompletionData: any;
  maxCompletionDate: any;
  managerAddressError = false;
  granteeAddressError = [];
  currency = [];

  tinymceInit: any;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  videoExtention = [".3gp", ".mp4", ".webm", ".flv", ".avi", ".HDV", ".mkv"]

  public myForm: FormGroup;

  constructor(public modalCtrl: ModalController,
    private grantService: GrantService,
    private userService: UserService,
    private angularFireStorage: AngularFireStorage,
    private toastr: ToastrService,
    public router: Router,
    private fb: FormBuilder,
    private ethcontractService: EthcontractService,
    private utils: UtilsService
  ) {

    this.bindModel();
    let curruntDate = new Date();
    this.maxYear = curruntDate.getFullYear() + 100;
    this.minYear = moment(curruntDate).add(1, 'days').format('YYYY-MM-DD')


    this.user = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));

    this.userService.getAll().subscribe((res: HTTPRESPONSE) => {
      this.userData = res.data;
      res.data.map((data) => {
        if (data.hasOwnProperty('publicAddress') && data.publicAddress) {
          this.tagInputItems.push(data);
          this.managerTagInputItem.push(data);
        }
      });
    })
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
        let temp = 0;
        this.grantee.map((data) => {
          temp += +data.controls.allocationAmount.value
        })
        this.myForm.controls.targetFunding.setValue(temp);
        this.checkAddress()
      });

    this.form.grantManager.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(async (val: string) => {
        console.log("grantManager.valueChanges");
        this.checkAddress()
      });

    this.singleDeliveryControles.controls.fundingExpiryDate.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(async (val: string) => {
        this.singleDeliveryControles.controls.completionDate.reset();
        this.minCompletionData = moment.utc(val).add(1, 'days').format('YYYY-MM-DD');
      });

    this.tinymceInit = {
      selector: 'textarea',
      height: 500,
      menubar: true,
      plugins: [
        'autolink',
        'codesample',
        'link',
        'lists',
        'media',
        'powerpaste',
        'table',
        'image',
        'quickbars',
        'codesample',
        'code',
        'help',
      ],
      toolbar: true,
      // toolbar: 'fontselect',
      // font_formats: 'Arial=arial;Helvetica=helvetica;Sans-serif=sans-serif;Courier=courier;Courier New=courier new;Courier Prime=courier prime;Monospace=monospace;AkrutiKndPadmini=Akpdmi-n',
      quickbars_insert_toolbar: 'quicktable image media codesample',
      quickbars_selection_toolbar: 'bold italic underline | formatselect | blockquote quicklink',
      contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
      powerpaste_word_import: 'clean',
      powerpaste_html_import: 'clean',
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

                console.log("downloadURL", downloadURL);
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

              console.log("downloadURL", downloadURL);
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
      grantName: ['', Validators.required],
      description: [''],
      images: this.fb.array([]),
      grantManager: ['', [Validators.required, addressValidator]],
      type: ['singleDeliveryDate', Validators.required],
      targetFunding: [null, Validators.required],
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
      allocationAmount: new FormControl(null, Validators.required)
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

  checkAddress() {
    let valid = true
    this.managerAddressError = false;
    this.myForm.controls.grantees.value.map((map1, index) => {
      this.granteeAddressError[index] = false;
      if (map1.grantee == this.myForm.controls.grantManager.value) {
        this.managerAddressError = true;
        this.granteeAddressError[index] = true
        valid = false
      }

      this.myForm.controls.grantees.value.map((map2, i) => {
        if (map1.grantee == map2.grantee && index != i) {
          this.granteeAddressError[index] = true
          this.granteeAddressError[i] = true
          valid = false
        }
      })
    });

    return valid;
  }

  async deployeContract() {
    let data, fundingExpiration, contractExpiration;

    if (this.grantForm.type == "singleDeliveryDate") {
      fundingExpiration = moment(this.grantForm.singleDeliveryDate.fundingExpiryDate).format("X");
      contractExpiration = moment(this.grantForm.singleDeliveryDate.completionDate).format("X");
    } else {
      // console.log("this.grantForm.multipleMilestones", this.grantForm.multipleMilestones[this.grantForm.multipleMilestones.length - 1].completionDate);
      fundingExpiration = moment(this.grantForm.multipleMilestones[this.grantForm.multipleMilestones.length - 1].completionDate).format("X");
      contractExpiration = moment(this.grantForm.multipleMilestones[this.grantForm.multipleMilestones.length - 1].completionDate).add(1, 'days').format("X");
    }

    data = {
      grantees: this.grantForm.grantees.map((data) => { return data.grantee }),
      amounts: this.grantForm.grantees.map((data) => { return data.allocationAmount }),
      manager: this.grantForm.grantManager,
      currency: this.grantForm.currency,
      targetFunding: this.grantForm.targetFunding,
      fundingExpiration: fundingExpiration,
      contractExpiration: contractExpiration
    }

    // console.log("data", data);
    let contract = await this.ethcontractService.deployContract(data);
    return contract;
  }

  async  onSubmit() {
    this.submitted = true;
    // console.log("content", this.myForm.value)
    if (this.myForm.controls.type.value == "singleDeliveryDate") {
      if (this.myForm.controls.grantName.invalid || this.myForm.controls.currency.invalid || this.myForm.controls.singleDeliveryDate.invalid
        || this.myForm.controls.grantManager.invalid || this.myForm.controls.grantees.invalid) {
        return
      }
    } else {
      if (this.myForm.controls.grantName.invalid || this.myForm.controls.currency.invalid || this.myForm.controls.multipleMilestones.invalid
        || this.myForm.controls.grantManager.invalid || this.myForm.controls.grantees.invalid) {
        return
      }
    }

    if (!this.checkAddress()) {
      return
    };

    this.grantForm = JSON.parse(JSON.stringify(this.myForm.value));

    for (let i = 0; i < this.imageUpload.files.length; i++) {
      try {
        let imageURL = await this.utils.fileUpload(this.imageUpload.files[i].file, "grant-content")
        if (imageURL) {
          this.grantForm.images.push(imageURL)
        }
      } catch (e) { }
    }

    try {
      this.processing = true;
      let contract: any = await this.deployeContract();
      // console.log("contract", contract);

      if (contract.status == "success") {
        this.grantForm['contractId'] = contract.address;
        this.grantForm['hash'] = contract.hash;
        this.grantForm.content = this.grantForm.content.replace(/"/g, "&quot;");

        // console.log("this.grantForm", this.grantForm);

        this.grantService.createGrant(this.grantForm).subscribe((res: HTTPRESPONSE) => {
          this.processing = false;
          this.toastr.success(res.message, this.toastTitle);
          this.router.navigate(['pages/latest']);
        }, (err) => {
          this.processing = false;
          this.toastr.error(err.error.message, this.toastTitle);
        });
      } else {
        this.processing = false;
        this.toastr.error(contract.message);
      }
    } catch (e) {
      this.processing = false;
      this.toastr.error('Something went wrong !!', this.toastTitle);
    }
  }

  dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}