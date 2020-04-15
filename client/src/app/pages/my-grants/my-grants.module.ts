import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { MyGrantsComponent } from './my-grants.component';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';
import { ViewGruntModule } from '../view-grunt/view-grunt.module';
import { ViewGruntRequestRefundModule } from '../view-grunt-request-refund/view-grunt-request-refund.module';
import { ViewGruntUnmarkAsCompleteModule } from '../view-grunt-unmark-as-complete/view-grunt-unmark-as-complete.module';
import { ViewGruntNotificationsModule } from '../view-grunt-notifications/view-grunt-notifications.module';
import { ViewGruntComponent } from '../view-grunt/view-grunt.component';
import { ViewGruntRequestRefundComponent } from '../view-grunt-request-refund/view-grunt-request-refund.component';
import { ViewGruntUnmarkAsCompleteComponent } from '../view-grunt-unmark-as-complete/view-grunt-unmark-as-complete.component';
import { ViewGruntNotificationsComponent } from '../view-grunt-notifications/view-grunt-notifications.component';
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
    ViewGruntModule,
    ViewGruntRequestRefundModule,
    ViewGruntUnmarkAsCompleteModule,
    ViewGruntNotificationsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    ViewGruntComponent,
    ViewGruntRequestRefundComponent,
    ViewGruntUnmarkAsCompleteComponent,
    ViewGruntNotificationsComponent
  ],
  declarations: [MyGrantsComponent],
  providers: [GrantService]
})
export class MyGrantsModule { }
