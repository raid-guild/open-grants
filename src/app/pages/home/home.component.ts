import { Component } from '@angular/core';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { Router } from '@angular/router';
import { SubgraphService } from 'src/app/services/subgraph.service';
import { ethers, providers, utils, constants } from 'ethers';

const { AddressZero, Zero } = constants;

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  grants: any;
  latestGrant: any;

  constructor(
    private router: Router,
    private subgraphService: SubgraphService,
  ) {
    this.subgraphService.getGrantList().subscribe((res: any) => {
      this.grants = res.data.contracts;
      this.latestGrant = this.grants[0];
      this.grants.splice(0, 1);
    })
  }

  currencyCovert(currencyType, amount) {
    if (currencyType == AddressZero) {
      return ethers.utils.formatEther(amount);
    }
    return amount;
  }

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant/' + id])
  }
}