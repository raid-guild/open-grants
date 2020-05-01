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
  userData: any;
  allgrant: any;

  path: any;
  searchBar: boolean = false;
  myForm: FormGroup;
  searchSubscription: Subscription;
  searchResult: any = [];

  picture = false;

  @Output() onChange = new EventEmitter();

  constructor(
    public router: Router,
    private toastr: ToastrService,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private grantService: GrantService,
    public events: Events,
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService,
    private authenticationService: AuthenticationService,
  ) {

    let res = this.authService.getAuthState();
    this.isLogin = res.is_logged_in;

    this.events.subscribe('is_logged_in', (data) => {
      this.isLogin = data;
    });

    if (this.isLogin) {
      if (this.isLogin) {
        this.getUserData();
        this.events.subscribe('profile-change', (data) => {
          if (data) {
            this.getUserData();
          }
        });
      }
    }

    // this.path = this.route.snapshot.pathFromRoot[3].url[0].path;
    // if (this.path == "my-grants" || this.path == "latest-grants" || this.path == "trending-grants") {
    //   this.searchBar = true;
    // }

    this.myForm = this.fb.group({
      searchBox: new FormControl()
    });
  }

  ngOnInit() {
    // this.searchSubscription = this.myForm.controls.searchBox.valueChanges
    //   .pipe(
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((val: string) => {
    //     // console.log("val", val)
    //     if (val == '') {
    //       this.searchResult = [];
    //     } else {
    //       this.searchResult = []
    //       this.searchResult = this.allgrant.filter((data) => {
    //         // console.log("data.name.toLowerCase()", data.name.toLowerCase());
    //         return data.grantName.toLowerCase().includes(val.toLowerCase())
    //       });
    //       console.log("temp", this.searchResult);
    //     }
    //   })
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

  getUserData() {
    // this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
    this.userService.getUser().subscribe((res: HTTPRESPONSE) => {
      this.userData = res.data;
      if (this.userData && this.userData.hasOwnProperty('picture') && this.userData.picture) {
        this.picture = true;
      }
    });
  }

  onSearch() {
    this.onChange.emit(this.myForm.controls.searchBox.value);
  }

  selectGrant(value: any) {
    this.myForm.controls.searchBox.setValue(value.grantName);
    this.onSearch();
  }

  async confirmUser() {
    this.processing = true;

    try {
      if ('enable' in window.web3.currentProvider) {
        await window.web3.currentProvider.enable();
        console.log("window.web3.eth.coinbase",window.web3.eth.coinbase);
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
      .subscribe((res: HTTPRESPONSE) => {
        this.toastr.success(res.message, this.toastTitle);
        this.processing = false;
        this.router.navigate(['pages/profile']);
      }, (err) => {
        this.processing = false;
        this.toastr.error(err.error.message, this.toastTitle);
      });
  }

  ngOnDestroy() {
  }

}
