import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core'
import { PopoverController, ModalController, Events } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GrantService } from 'src/app/services/grant.service';
import { UserService } from 'src/app/services/user.service';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { AuthService, AuthState } from 'src/app/services/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ThreeBoxService } from 'src/app/services/threeBox.service';
import { async } from '@angular/core/testing';
import { AppSettings } from 'src/app/config/app.config';

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
  userData: any;
  allgrant: any;

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
    private userService: UserService,
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
      }
    });

    // this.path = this.route.snapshot.pathFromRoot[3].url[0].path;
    // if (this.path == "my-grants" || this.path == "latest-grants" || this.path == "trending-grants") {
    //   this.searchBar = true;
    // }

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
    this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
    if (this.userData && this.userData.hasOwnProperty('publicAddress') && this.userData.publicAddress) {
      this.user3BoxProfile = await this.threeBoxService.getProfile(this.userData.publicAddress);
      if (this.user3BoxProfile && this.user3BoxProfile.hasOwnProperty('image') && this.user3BoxProfile.image) {
        this.isImage = true;
      }
    }
  }

  async confirmUser() {
    this.processing = true;

    try {
      if ('enable' in window.web3.currentProvider) {
        await window.web3.currentProvider.enable();
        this.authenticationService.confirmUser({ publicAddress: window.web3.eth.coinbase }).subscribe(async (res: HTTPRESPONSE) => {
          try {
            let signMessage: any = await this.handleSignMessage(res.data)
            this.login(signMessage);
          } catch (error) {
            this.processing = false;
            this.toastr.error(error.message, this.toastTitle);
          }
        }, (err) => {
          this.processing = false;
          this.toastr.error(err.error.message, this.toastTitle);
        });
      }
    } catch (error) {
      this.processing = false;
      this.toastr.error(error.message, this.toastTitle);
    }
  }

  handleSignMessage({ publicAddress, nonce }) {
    return new Promise((resolve, reject) => {
      window.web3.personal.sign(
        window.web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) reject(err);
          resolve({ publicAddress, signature });
        }
      )
    })
  }

  login(signMessage) {
    this.authenticationService.signin({ publicAddress: signMessage.publicAddress, signature: signMessage.signature })
      .subscribe(async (res: HTTPRESPONSE) => {
        this.toastr.success(res.message, this.toastTitle);
        this.processing = false;
      }, (err) => {
        this.processing = false;
        this.toastr.error(err.error.message, this.toastTitle);
      });
  }

  ngOnDestroy() {
  }

}
