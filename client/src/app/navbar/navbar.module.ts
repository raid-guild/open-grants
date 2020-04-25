import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuPopoverComponent } from './menu-popover/menu-popover.component';
import { UserService } from '../services/user.service';
import { GrantService } from '../services/grant.service';
import { AuthService } from '../services/auth.service';
import { AuthenticationService } from '../services/authentication.service';

@NgModule({
  declarations: [
    NavbarComponent,
    HeaderComponent,
    MenuPopoverComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    GrantService,
    AuthService,
    AuthenticationService
  ],
  exports: [
    NavbarComponent
  ],
  entryComponents: [MenuPopoverComponent]
})
export class NavbarModule { }
