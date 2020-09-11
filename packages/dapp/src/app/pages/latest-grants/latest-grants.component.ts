import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubgraphService } from 'src/app/services/subgraph.service';
import { ethers, constants } from 'ethers';

const { AddressZero } = constants;

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

  constructor(
    public popoverCtrl: PopoverController,
    private router: Router,
    public modalController: ModalController,
    private subgraphService: SubgraphService,
  ) {
    this.getAllGrants();
  }

  ngOnInit() {
    this.searchBox = new FormControl('');

    this.searchBox.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((val: string) => {
        if (val === '') {
          this.searchResult = [];
          this.searchResult = this.allGrant;
        } else {
          this.searchResult = [];
          this.searchResult = this.allGrant.filter(data => {
            // console.log("data.name.toLowerCase()", data.name.toLowerCase());
            return data.grantName.toLowerCase().includes(val.toLowerCase());
          });
        }
      });
  }

  onCancel(event) {}

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant/' + id]);
  }

  getAllGrants() {
    this.subgraphService.getGrantList().subscribe((res: any) => {
      // console.log("contracts", res.data.contracts.length)
      this.allGrant = JSON.parse(JSON.stringify(res.data.contracts));
    });
  }

  currencyCovert(currencyType, amount) {
    if (currencyType === AddressZero) {
      return ethers.utils.formatEther(amount);
    }
    return amount;
  }
}
