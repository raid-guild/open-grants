import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AmountsReceiveComponent } from './amounts-receive.component';
import { HeaderModule } from '../header/header.module';


const routes: Routes = [
  {
    path: '',
    component: AmountsReceiveComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AmountsReceiveComponent]
})
export class AmountsReceiveModule { }
