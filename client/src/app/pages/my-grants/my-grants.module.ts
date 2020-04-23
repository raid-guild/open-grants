import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { MyGrantsComponent } from './my-grants.component';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';
import { ViewGrantModule } from '../view-grant/view-grant.module';
import { ViewGrantRequestRefundModule } from '../view-grant-request-refund/view-grant-request-refund.module';
import { ViewGrantUnmarkAsCompleteModule } from '../view-grant-unmark-as-complete/view-grant-unmark-as-complete.module';
import { ViewGrantNotificationsModule } from '../view-grant-notifications/view-grant-notifications.module';
import { ViewGrantComponent } from '../view-grant/view-grant.component';
import { ViewGrantRequestRefundComponent } from '../view-grant-request-refund/view-grant-request-refund.component';
import { ViewGrantUnmarkAsCompleteComponent } from '../view-grant-unmark-as-complete/view-grant-unmark-as-complete.component';
import { ViewGrantNotificationsComponent } from '../view-grant-notifications/view-grant-notifications.component';
import { AmountsReceiveComponent } from '../amounts-receive/amounts-receive.component';
import { GrantService } from 'src/app/services/grant.service';
import { HeaderModule } from '../header/header.module';

const routes: Routes = [
  {
    path: '',
    component: MyGrantsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    ViewGrantModule,
    ViewGrantRequestRefundModule,
    ViewGrantUnmarkAsCompleteModule,
    ViewGrantNotificationsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    ViewGrantComponent,
    ViewGrantRequestRefundComponent,
    ViewGrantUnmarkAsCompleteComponent,
    ViewGrantNotificationsComponent
  ],
  declarations: [MyGrantsComponent],
  providers: [GrantService]
})
export class MyGrantsModule {
  constructor() {
    console.log("MyGrantsModule")
  }
}
