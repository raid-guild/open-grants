import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';

const routes: Routes = [
  {
    path: '',
    component: MenuPopoverComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [MenuPopoverComponent]
})
export class MenuPopoverModule { }
