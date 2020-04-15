import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ViewGruntNotificationsComponent } from './view-grunt-notifications.component';


const routes: Routes = [
  {
    path: '',
    component: ViewGruntNotificationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [ViewGruntNotificationsComponent]
})
export class ViewGruntNotificationsModule {}
