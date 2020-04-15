import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TrendingGrantsComponent } from './trending-grants.component';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';
import { HeaderModule } from '../header/header.module';
import { ViewGruntComponent } from '../view-grunt/view-grunt.component';
import { ViewGruntModule } from '../view-grunt/view-grunt.module';
import { GrantService } from 'src/app/services/grant.service';


const routes: Routes = [
  {
    path: '',
    component: TrendingGrantsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    ViewGruntModule,
    MenuPopoverModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [MenuPopoverComponent,ViewGruntComponent],
  declarations: [TrendingGrantsComponent],
  providers : [GrantService]
})
export class TrendingGrantsModule {}
