import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SubgraphService } from 'src/app/services/subgraph.service';
import { AppSettings } from 'src/app/config/app.config';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-grants',
  templateUrl: './my-grants.component.html',
  styleUrls: ['./my-grants.component.scss'],
})
export class MyGrantsComponent implements OnInit {
  userEthAddress = '';
  createdByMeGrant: any;
  fundedByMeGrant: any;
  mangedByMeGrant: any;

  searchCreatedBy: any;
  searchFundedBy: any;
  searchManagedBy: any;

  constructor(public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private subgraphService: SubgraphService,
    private authService: AuthService,
    private router: Router,
    public events: Events
  ) {
    this.getAllGrants();
  }

  ngOnInit() {
    this.events.subscribe('is_logged_in', (data) => {
      setTimeout(() => {
        this.getAllGrants();
      }, 100);
    });
  }

  getUserEthAddress() {
    this.userEthAddress = this.authService.getAuthUserId();
  }

  getAllGrants() {
    this.getUserEthAddress();

    this.subgraphService.getGrantByCreateby(this.userEthAddress).subscribe((res: any) => {
      this.createdByMeGrant = JSON.parse(JSON.stringify(res.data.contracts));
      console.log("createdByMeGrant", this.createdByMeGrant)
    });


  }

  handleChange(e) {
    if (e == '') {
      this.searchCreatedBy = this.createdByMeGrant;
      this.searchFundedBy = this.fundedByMeGrant;
      this.searchManagedBy = this.mangedByMeGrant;
    } else {
      this.searchCreatedBy = this.createdByMeGrant.filter((data) => {
        return data.grantName.toLowerCase().includes(e.toLowerCase())
      });

      this.searchFundedBy = this.fundedByMeGrant.filter((data) => {
        return data.grantName.toLowerCase().includes(e.toLowerCase())
      });

      this.searchManagedBy = this.mangedByMeGrant.filter((data) => {
        return data.grantName.toLowerCase().includes(e.toLowerCase())
      });
    }
  }

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant/' + id])
  }
}
