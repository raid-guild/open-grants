import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { GrantService } from 'src/app/services/grant.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { ViewGruntComponent } from '../view-grunt/view-grunt.component';
import { ENVIRONMENT } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trending-grants',
  templateUrl: './trending-grants.component.html',
  styleUrls: ['./trending-grants.component.scss'],
})
export class TrendingGrantsComponent implements OnInit {

  trendingGrants: any;
  seachResult: any;

  constructor(public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private grantService: GrantService,
    private router: Router
  ) {

    this.getTrendingGrants();
  }

  ngOnInit() {
  }

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant-details/' + id])
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

  handleChange(e) {
    console.log("e", e);
    if (e == '') {
      this.seachResult = this.trendingGrants;
    } else {
      this.seachResult = this.trendingGrants.filter((data) => {
        return data.grantName.toLowerCase().includes(e.toLowerCase())
      });
      // console.log("temp", this.allGrant);
    }
  }

  async viewGrunt(data: any) {
    const modal = await this.modalController.create({
      component: ViewGruntComponent,
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
      this.seachResult = this.trendingGrants;
    });
  }
}
