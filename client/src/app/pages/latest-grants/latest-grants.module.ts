import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { LatestGrantsComponent } from './latest-grants.component';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { GrantService } from 'src/app/services/grant.service';
import { HeaderModule } from '../header/header.module';
import { ViewGruntModule } from '../view-grunt/view-grunt.module';
import { ViewGruntComponent } from '../view-grunt/view-grunt.component';


const routes: Routes = [
  {
    path: '',
    component: LatestGrantsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPopoverModule,
    HeaderModule,
    ViewGruntModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [MenuPopoverComponent, ViewGruntComponent],
  declarations: [LatestGrantsComponent],
  providers: [GrantService]
})
export class LatestGrantsModule { }
