import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ENVIRONMENT } from 'src/environments/environment';
import { GrantFundService } from 'src/app/services/grantFund.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from 'src/app/config/app.config';
import { Router } from '@angular/router';
import { GrantService } from 'src/app/services/grant.service';
import * as moment from 'moment';
import { EthcontractService } from 'src/app/services/ethcontract.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-grant',
  templateUrl: './view-grant.component.html',
  styleUrls: ['./view-grant.component.scss'],
})
export class ViewGrantComponent implements OnInit {

  @Input() grantData: any;

  statusEnum = {
    PENDING: "pending",
    COMPLETED: "completed",
    TOBERECEIVED: "tobereceived"
  }

  grant: any;
  toastTitle = "Grant Funding"
  multipleMilestones = false;
  processing = false;
  submitted = false;
  allowFunding = true;

  grantFund = {
    _id: '',
    grant: '',
    donor: '',
    amount: null
  }

  constructor(
    public modalCtrl: ModalController,
    private toastr: ToastrService,
    private navParams: NavParams,
    public router: Router,
    private grantFundService: GrantFundService,
    private grantService: GrantService,
    private ethcontractService: EthcontractService,
  ) {

    this.grantData = navParams.get('grantData');

    (async () => {
      try {
        let res = await this.grantService.getById(this.grantData._id).toPromise();
        this.grant = res.data;
        console.log("this.grant", this.grant)

        if (this.grant.type == "multipleMilestones") {
          this.multipleMilestones = true;

          let tobereceived = true;
          this.grant.multipleMilestones = this.grant.multipleMilestones.map((data: any) => {
            let status: any;
            let now = new Date().toISOString();

            let isAfter = moment(data.completionDate).isAfter(moment(now));
            // let isBefore = moment(data.completionDate).isBefore(moment(now));

            if (isAfter) {
              if (tobereceived) {
                status = this.statusEnum.TOBERECEIVED;
                tobereceived = false;
              } else {
                status = this.statusEnum.PENDING;
              }
            }

            if (!isAfter) {
              status = this.statusEnum.COMPLETED;
            }

            data.completionDate = moment(data.completionDate).format('DD/MM/YYYY');
            data = {
              ...data,
              status: status
            }
            return data;
          });
        } else {
          this.grant.singleDeliveryDate.completionDate = moment(this.grant.singleDeliveryDate.completionDate).format('DD/MM/YYYY');
          this.grant.singleDeliveryDate.fundingExpiryDate = moment(this.grant.singleDeliveryDate.fundingExpiryDate).format('DD/MM/YYYY');

          let now = new Date().toISOString();
          let isAfter = moment(this.grant.singleDeliveryDate.completionDate).isAfter(moment(now));

          if (isAfter) {
            this.grant.singleDeliveryDate["status"] = this.statusEnum.COMPLETED;
          } else {
            this.grant.singleDeliveryDate["status"] = this.statusEnum.TOBERECEIVED;
          }
        }

        if (this.grant.status == "cancel") {
          this.allowFunding = false;
        }

        // console.log("this.grant", this.grant);

      } catch (e) {
        this.toastr.error('Error. Please try after sometime', 'Grant');
      }

    })();

  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

  // items = [
  //   { status: "completed", title: "Milestone 1", date: "02.02.2019", cost: "1,500", totalcost: "5,000" },
  //   { status: "completed", title: "Milestone 1", date: "02.02.2019", cost: "1,500", totalcost: "5,000" },
  //   { status: "tobereceivesd", title: "Milestone 1", date: "02.02.2019", cost: "1,500", totalcost: "5,000" },
  //   { status: "pending", title: "Milestone 1", date: "02.02.2019", cost: "1,500", totalcost: "5,000" },
  //   { status: "pending", title: "Milestone 1", date: "02.02.2019", cost: "1,500", totalcost: "5,000" }
  // ]

  ngOnInit() {

  }
}
