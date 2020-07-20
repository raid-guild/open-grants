import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core'
import { PopoverController, ModalController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { AuthService, AuthState } from 'src/app/services/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ThreeBoxService } from 'src/app/services/threeBox.service';
import { async } from '@angular/core/testing';
import { AppSettings } from 'src/app/config/app.config';
import { PopupComponent } from 'src/app/pages/popup/popup.component';

declare let window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  processing = false;
  toastTitle = 'Login';

  authsubscription: Subscription;
  isLogin = false;
  user3BoxProfile: any;
  userEthAddress: any;

  path: any;
  searchBar: boolean = false;
  myForm: FormGroup;
  searchSubscription: Subscription;
  searchResult: any = [];

  isImage = false;

  @Output() onChange = new EventEmitter();

  constructor(
    public router: Router,
    private toastr: ToastrService,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    public events: Events,
    private fb: FormBuilder,
    private authService: AuthService,
    private authenticationService: AuthenticationService,
    private threeBoxService: ThreeBoxService
  ) {

    let res = this.authService.getAuthState();
    this.isLogin = res.is_logged_in;

    this.events.subscribe('is_logged_in', (data) => {
      this.isLogin = data;

      if (this.isLogin) {
        this.getUserData();
      } else {
        this.isImage = false;
      }
    });

    this.myForm = this.fb.group({
      searchBox: new FormControl()
    });
  }

  ngOnInit() {
    this.getUserData();
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

  async getUserData() {
    this.userEthAddress = localStorage.getItem(AppSettings.localStorage_keys.userEthAddress);
    if (this.userEthAddress) {
      this.user3BoxProfile = await this.threeBoxService.getUserProfile(this.userEthAddress);
      if (this.user3BoxProfile && this.user3BoxProfile.hasOwnProperty('image') && this.user3BoxProfile.image) {
        this.isImage = true;
      }
    }
  }

  async login() {
    const modal = await this.modalController.create({
      component: PopupComponent,
      cssClass: 'custom-modal-style',
      mode: "ios",
      componentProps: {
        modelType: "login"
      }
    });

    modal.onDidDismiss()
      .then((data) => {
      });

    return await modal.present();
  }

  ngOnDestroy() {
  }

}
