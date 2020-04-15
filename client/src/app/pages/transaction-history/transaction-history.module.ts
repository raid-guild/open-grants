import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransactionHistoryComponent } from './transaction-history.component';
import { HeaderModule } from '../header/header.module';
import { GrantFundService } from 'src/app/services/grantFund.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  {
    path: '',
    component: TransactionHistoryComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    NgxChartsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransactionHistoryComponent],
  providers: [GrantFundService]
})
export class TransactionHistoryModule { }
