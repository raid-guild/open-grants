import { Component, OnInit } from '@angular/core';
import { GrantFundService } from 'src/app/services/grantFund.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit {
  allGrants: any;

  chartData: any;

  title = 'Angular Charts';
  view: any[] = [600, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Grant Name';
  showYAxisLabel = true;
  yAxisLabel = 'Donate Amount';
  timeline = true;
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  //pie
  showLabels = true;

  constructor(
    private toastr: ToastrService,
    private grantFundService: GrantFundService,
  ) {

    (async () => {
      try {
        let res = await this.grantFundService.getGrantFundedByMe().toPromise();
        this.allGrants = res.data;
        console.log("this.allGrants", this.allGrants);

        this.chartData = this.allGrants.map((data) => {
          let temp = {
            name: data.grant.grantName,
            value: data.fundingAmount / data.grant.fund * 100
          }
          return temp;
        });

      } catch (e) {
        this.toastr.error('Error. Please try after sometime', 'Grant');
      }

    })();
  }

  ngOnInit() {
  }

  onSelect(event) {
  }
}
