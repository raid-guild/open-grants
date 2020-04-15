import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GrantDetailsComponent } from './grant-details.component';
import { HeaderModule } from '../header/header.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyGrantsComponent } from '../my-grants/my-grants.component';
import { MyGrantsModule } from '../my-grants/my-grants.module';
import { NumberonlyDirectiveModule } from 'src/app/common/directives/numberOnlyDirective/numberonlyDirective.module';
import { GrantService } from 'src/app/services/grant.service';
import { PayoutService } from 'src/app/services/payout.service';
import { GrantFundService } from 'src/app/services/grantFund.service';

const routes: Routes = [
  {
    path: '',
    component: MyGrantsComponent
  },
  {
    path: ':id',
    component: GrantDetailsComponent,
  }
];

@NgModule({
  declarations: [GrantDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    MyGrantsModule,
    NumberonlyDirectiveModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    GrantService,
    GrantFundService,
    PayoutService
  ]
})
export class GrantDetailsModule {
  constructor() {
    console.log("GrantDetailsModule");
  }
}
