import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
// import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';

import { PagesComponent } from './pages.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { HomeComponent } from './home/home.component';
import { LatestGrantsComponent } from './latest-grants/latest-grants.component';
import { MyGrantsComponent } from './my-grants/my-grants.component';
import { NumberonlyDirectiveModule } from '../common/directives/numberOnlyDirective/numberonlyDirective.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CreateNewGrantComponent } from './create-new-grant/create-new-grant.component';
import { ProfileComponent } from './profile/profile.component';
import { GrantDetailsComponent } from './grant-details/grant-details.component';
import { SubgraphService } from '../services/subgraph.service';
import { HeaderComponent } from '../navbar/header/header.component';
import { MenuPopoverComponent } from '../navbar/menu-popover/menu-popover.component';
import { PayoutComponent } from './payout/payout.component';
import { GrantComponent } from './grant/grant.component';
import { PopupComponent } from './popup/popup.component';

const PAGES_COMPONENTS = [
    PagesComponent,
];

@NgModule({
    declarations: [
        HeaderComponent,
        PopupComponent,
        MenuPopoverComponent,
        PagesComponent,
        HomeComponent,
        PayoutComponent,
        ProfileComponent,
        GrantComponent,
        MyGrantsComponent,
        GrantDetailsComponent,
        LatestGrantsComponent,
        CreateNewGrantComponent,
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PagesRoutingModule,
        EditorModule,
        NumberonlyDirectiveModule,
        // MiscellaneousModule
    ],
    entryComponents: [
        PopupComponent,
        PayoutComponent,
        MenuPopoverComponent,
    ],
    providers: [
        SubgraphService
    ]
})
export class PagesModule { }
