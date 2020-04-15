import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ViewGruntUnmarkAsCompleteComponent } from './view-grunt-unmark-as-complete.component';

const routes: Routes = [
  {
    path: '',
    component: ViewGruntUnmarkAsCompleteComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [ViewGruntUnmarkAsCompleteComponent]
})
export class ViewGruntUnmarkAsCompleteModule {}
