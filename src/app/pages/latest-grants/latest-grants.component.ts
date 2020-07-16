import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubgraphService } from 'src/app/services/subgraph.service';
import { ethers, providers, utils } from 'ethers';
import { AddressZero, Zero } from "ethers/constants";
// import { OrbitService } from 'src/app/services/orbit.service';

@Component({
  selector: 'app-latest-grants',
  templateUrl: './latest-grants.component.html',
  styleUrls: ['./latest-grants.component.scss'],
})
export class LatestGrantsComponent implements OnInit {
  allGrant: any;
  grantOrbitData: any;
  searchBox: FormControl;
  searchResult: any = [];
  data = [];
  image = "https://firebasestorage.googleapis.com/v0/b/grants-platform.appspot.com/o/grant-content%2F1590246149579_roadie_3_tuner-ccbc4c5.jpg?alt=media";

  constructor(public popoverCtrl: PopoverController,
    private router: Router,
    public modalController: ModalController,
    private subgraphService: SubgraphService,
    // private orbitService: OrbitService
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

  async getGrantOrbitData(id: string, key: string) {
    // let grant = await this.orbitService.getGrantsById(id);
    // // console.log("grant", grant);
    // if (grant) {
    //   return grant[key]
    // }
    return key
  }

  grantDetails(id: string) {
    this.router.navigate(['/pages/grant/' + id])
  }

  getAllGrants() {
    this.subgraphService.getGrantList(0, 10).subscribe((res: any) => {
      // console.log("res.data.contracts", res.data.contracts);

      this.allGrant = JSON.parse(JSON.stringify(res.data.contracts));
      this.allGrant = this.allGrant.map((grant) => {
        if (grant.uri) {
          grant.uri = utils.parseBytes32String(grant.uri)
        }
        return grant;
      });

      this.getOrbitData();
    });
  }

  async getOrbitData() {
    // let orbitData: any = await this.orbitService.getGrants();

    this.allGrant = this.allGrant.map((grant) => {
      grant['_id'] = '';
      grant['name'] = '';
      grant['description'] = '';
      grant['images'] = [''];
      grant['content'] = '';

      // let findData = orbitData.find(data => data._id == grant.uri);
      // if (findData) {
      //   grant._id = findData._id;
      //   grant.name = findData.name;
      //   grant.description = findData.description;
      //   grant.images = findData.images;
      //   grant.content = findData.content;
      // }

      return grant;
    })

    console.log("this.allGrant", this.allGrant);
    this.searchResult = this.allGrant;
  }

  currencyCovert(currencyType, amount) {
    if (currencyType == AddressZero) {
      return ethers.utils.formatEther(amount);
    }
    return amount;
  }
}
