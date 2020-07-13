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
import { TrendingGrantsComponent } from './trending-grants/trending-grants.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MyGrantsComponent } from './my-grants/my-grants.component';
import { NumberonlyDirectiveModule } from '../common/directives/numberOnlyDirective/numberonlyDirective.module';
import { TagInputModule } from 'ngx-chips';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CreateNewGrantComponent } from './create-new-grant/create-new-grant.component';
import { ProfileComponent } from './profile/profile.component';
import { GrantDetailsComponent } from './grant-details/grant-details.component';
import { ImageUploadModule } from 'angular2-image-upload';
import { SubgraphService } from '../services/subgraph.service';
import { HeaderComponent } from '../navbar/header/header.component';
import { MenuPopoverComponent } from '../navbar/menu-popover/menu-popover.component';
import { AuthenticationService } from '../services/authentication.service';
import { PayoutComponent } from './payout/payout.component';
import { GrantComponent } from './grant/grant.component';
import { PopupComponent } from './popup/popup.component';
import { OrbitService } from '../services/orbit.service';

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
        TrendingGrantsComponent,
        CreateNewGrantComponent,
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        PagesRoutingModule,
        TagInputModule,
        EditorModule,
        NgxChartsModule,
        NumberonlyDirectiveModule,
        ImageUploadModule.forRoot(),
        // MiscellaneousModule
    ],
    entryComponents: [
        PopupComponent,
        PayoutComponent,
        MenuPopoverComponent,
    ],
    providers: [
        SubgraphService,
        AuthenticationService
    ]
})
export class PagesModule {
    constructor(

        private orbitService: OrbitService

    ) {

    }
}
