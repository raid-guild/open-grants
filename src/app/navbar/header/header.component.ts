import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
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

  isLogin: BehaviorSubject<boolean>;
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
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.myForm = this.fb.group({
      searchBox: new FormControl()
    });
  }

  ngOnInit() {
    this.getUserData();
    this.isLogin = this.authService.getLoggedIn();
  }

  async userMenuPopover($event) {
    const popover = await this.popoverCtrl.create({
      component: MenuPopoverComponent,
      event,
      translucent: true,
      cssClass: 'poopover-user-option'
    });

    return await popover.present();
  }

  async getUserData() {

  }


  async login() {

    const modal = await this.modalController.create({
      component: PopupComponent,
      cssClass: 'custom-modal-style',
      mode: 'ios',
      componentProps: {
        modelType: 'login'
      }
    });

    return await modal.present();

  }

  ngOnDestroy() {
  }

}
