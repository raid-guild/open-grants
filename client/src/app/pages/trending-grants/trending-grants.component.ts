import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubgraphService } from 'src/app/services/subgraph.service';
import { ethers, providers, utils } from 'ethers';
import { AddressZero, Zero } from "ethers/constants";

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
    private subgraphService: SubgraphService,
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

  onCancel(event) { }

  getTrendingGrants() {
    this.subgraphService.getGrantList().subscribe((res: any) => {
      console.log("res", res.data.contracts);
      this.searchResult = res.data.contracts;
    })
  }

  currencyCovert(currencyType, amount) {
    if (currencyType == AddressZero) {
      return ethers.utils.formatEther(amount);
    }
    return amount;
  }
}
