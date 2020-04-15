import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ViewGrantNotificationsComponent } from './view-grant-notifications.component';


const routes: Routes = [
  {
    path: '',
    component: ViewGrantNotificationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [ViewGrantNotificationsComponent]
})
export class ViewGrantNotificationsModule {}
