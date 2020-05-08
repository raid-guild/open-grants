import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { GrantService } from 'src/app/services/grant.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { ViewGrantComponent } from '../view-grant/view-grant.component';
import { ENVIRONMENT } from 'src/environments/environment';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-trending-grants',
  templateUrl: './trending-grants.component.html',
  styleUrls: ['./trending-grants.component.scss'],
})
export class TrendingGrantsComponent implements OnInit {
  trendingGrants: any;
  searchBox: FormControl;
  searchResult: any = [];

  constructor(public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private grantService: GrantService,
    private router: Router
  ) {

    this.getTrendingGrants();
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
          this.searchResult = this.trendingGrants;
        } else {
          this.searchResult = []
          this.searchResult = this.trendingGrants.filter((data) => {
            // console.log("data.name.toLowerCase()", data.name.toLowerCase());
            return data.grantName.toLowerCase().includes(val.toLowerCase())
          });
        }
      })
  }

  ngOnInit() {
  }

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant/' + id])
  }

  handleChange(e) {
    console.log("e", e);
    if (e == '') {
      this.searchResult = this.trendingGrants;
    } else {
      this.searchResult = this.trendingGrants.filter((data) => {
        return data.grantName.toLowerCase().includes(e.toLowerCase())
      });
      // console.log("temp", this.allGrant);
    }
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
        console.log(reload)
        if (reload && reload.hasOwnProperty('reload') && reload.reload) {
          this.getTrendingGrants();
        }
      });

    return await modal.present();
  }

  getTrendingGrants() {
    this.grantService.getTrendingGrants().subscribe((res: HTTPRESPONSE) => {
      this.trendingGrants = res.data;
      this.searchResult = this.trendingGrants;
    });
  }
}
