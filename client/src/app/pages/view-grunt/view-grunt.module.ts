import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ViewGruntComponent } from './view-grunt.component';
import { GrantFundService } from 'src/app/services/grantFund.service';
import { GrantService } from 'src/app/services/grant.service';
import { NumberonlyDirectiveModule } from 'src/app/common/directives/numberOnlyDirective/numberonlyDirective.module';


const routes: Routes = [
  {
    path: '',
    component: ViewGruntComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NumberonlyDirectiveModule
    // RouterModule.forChild(routes)
  ],
  declarations: [ViewGruntComponent],
  providers: [GrantFundService, GrantService]
})
export class ViewGruntModule { }
