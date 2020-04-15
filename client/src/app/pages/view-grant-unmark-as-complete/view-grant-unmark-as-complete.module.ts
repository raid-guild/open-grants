import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ViewGrantUnmarkAsCompleteComponent } from './view-grant-unmark-as-complete.component';

const routes: Routes = [
  {
    path: '',
    component: ViewGrantUnmarkAsCompleteComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [ViewGrantUnmarkAsCompleteComponent]
})
export class ViewGrantUnmarkAsCompleteModule {}
