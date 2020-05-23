import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { GrantService, IGrant } from 'src/app/services/grant.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { ENVIRONMENT } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ViewGrantComponent } from '../view-grant/view-grant.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-latest-grants',
  templateUrl: './latest-grants.component.html',
  styleUrls: ['./latest-grants.component.scss'],
})
export class LatestGrantsComponent implements OnInit {
  allGrant: any;
  searchBox: FormControl;
  searchResult: any = [];
  data = [];
  constructor(public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private grantService: GrantService,
    private router: Router,
  ) {

    this.getAllGrants();
  }

  ngOnInit() {
    this.searchBox = new FormControl('');

    this.searchBox.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((val: string) => {
        // console.log("val", val)
        if (val == '') {
          this.searchResult = [];
          this.searchResult = this.allGrant;
        } else {
          this.searchResult = []
          this.searchResult = this.allGrant.filter((data) => {
            // console.log("data.name.toLowerCase()", data.name.toLowerCase());
            return data.grantName.toLowerCase().includes(val.toLowerCase())
          });
        }
      })
  }

  onCancel(event) { }

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant/' + id])
  }

  async viewGrant(data: any) {
    const modal = await this.modalController.create({
      component: ViewGrantComponent,
      cssClass: 'custom-modal-style',
      mode: "ios",
      componentProps: {
        grantData: data
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        const reload = data['data'];
        // console.log(reload)
        if (reload && reload.hasOwnProperty('reload') && reload.reload) {
          this.getAllGrants();
        }
      });

    return await modal.present();
  }

  getAllGrants() {
    this.grantService.getAll().subscribe((res: HTTPRESPONSE) => {
      this.allGrant = res.data;
      this.searchResult = this.allGrant;
    });
  }
}
