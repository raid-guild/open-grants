import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ViewGruntRequestRefundComponent } from './view-grunt-request-refund.component';


const routes: Routes = [
  {
    path: '',
    component: ViewGruntRequestRefundComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [ViewGruntRequestRefundComponent]
})
export class ViewGruntRequestRefundModule {}
