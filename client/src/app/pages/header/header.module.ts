import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { MenuPopoverComponent } from '../menu-popover/menu-popover.component';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GrantService } from 'src/app/services/grant.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MenuPopoverModule,
  ],
  exports: [HeaderComponent],
  declarations: [HeaderComponent],
  entryComponents: [MenuPopoverComponent],
  providers: [AuthenticationService,GrantService]
})
export class HeaderModule { }
