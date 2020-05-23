import { Component } from '@angular/core';
import { GrantService } from 'src/app/services/grant.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  allGrant: any;
  latestGrant: any;

  constructor(
    private router: Router,
    private grantService: GrantService
  ) {
    this.grantService.getAll().subscribe((res: HTTPRESPONSE) => {
      this.allGrant = res.data;
      this.latestGrant = this.allGrant[0];
      this.allGrant.splice(0, 1);
    });
  }

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant/' + id])
  }
}