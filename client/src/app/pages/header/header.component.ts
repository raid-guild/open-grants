import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppSettings } from 'src/app/config/app.config';
import { ENVIRONMENT } from '../../../environments/environment';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { GrantService } from 'src/app/services/grant.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {
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
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private grantService: GrantService,
    public events: Events,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.getUserData();
    this.events.subscribe('profile-change', (data) => {
      if (data) {
        this.getUserData();
      }
    });

    this.path = this.route.snapshot.pathFromRoot[3].url[0].path;
    if (this.path == "my-grants" || this.path == "latest-grants" || this.path == "trending-grants") {
      this.searchBar = true;
    }

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

}
