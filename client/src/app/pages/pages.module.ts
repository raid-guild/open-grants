import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
// import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';

import { PagesComponent } from './pages.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { UserService } from '../services/user.service';
import { PublicKeyModelComponent } from './public-key-model/public-key-model.component';

const PAGES_COMPONENTS = [
    PagesComponent,
];

@NgModule({
    declarations: [
        PagesComponent,
        PublicKeyModelComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        PagesRoutingModule,
        // RouterModule.forChild(routes)
        // MiscellaneousModule
    ],
    entryComponents: [PublicKeyModelComponent],
    providers: [
        StatusBar,
        SplashScreen,
        UserService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }]
})
export class PagesModule {

}
