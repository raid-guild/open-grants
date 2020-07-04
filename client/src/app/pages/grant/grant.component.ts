import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Events } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { SubgraphService } from 'src/app/services/subgraph.service';
import { AuthService } from 'src/app/services/auth.service';
import { EthcontractService } from 'src/app/services/ethcontract.service';
import { async } from '@angular/core/testing';
import { UserManagementService } from 'src/app/services/user-management.service';
import { AddressZero, Zero } from "ethers/constants";
import { ethers, providers, utils } from 'ethers';

@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss'],
})
export class GrantComponent implements OnInit {
  grantAddress: string;
  grantData: any;
  userEthAddress: string;

  userEnum = {
    VISITOR: "visitor",
    MANAGER: "manager",
    GRANTEE: "grantee",
    DONOR: "donor",
  }
  constructor(
    public events: Events,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public modalController: ModalController,
    private subgraphService: SubgraphService,
    private authService: AuthService,
    private ethcontractService: EthcontractService,
    private userManagementService: UserManagementService,
  ) {
    this.grantAddress = this.route.snapshot.params.id || '';

    (async () => {
      let response: any = await this.subgraphService.getGrantByAddress(this.grantAddress).toPromise();
      this.grantData = response.data.contract;
    })();

    this.getUserEthAddress()
  }

  ngOnInit() {
    this.events.subscribe('is_logged_in', (data) => {
      setTimeout(() => {
        this.checkRoll();
      }, 100);
    });
  }

  getUserEthAddress() {
    this.userEthAddress = this.authService.getAuthUserId();
  }

  currencyCovert(currencyType, amount) {
    if (currencyType == AddressZero) {
      return ethers.utils.formatEther(amount);
    }
    return amount;
  }

  checkRoll() {
    this.getUserEthAddress()
  }

}
