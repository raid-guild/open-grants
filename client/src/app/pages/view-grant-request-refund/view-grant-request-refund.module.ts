import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ViewGrantRequestRefundComponent } from './view-grant-request-refund.component';


const routes: Routes = [
  {
    path: '',
    component: ViewGrantRequestRefundComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [ViewGrantRequestRefundComponent]
})
export class ViewGrantRequestRefundModule {}
