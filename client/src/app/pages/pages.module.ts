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
import { UserService } from '../services/user.service';
import { HomeComponent } from './home/home.component';
import { GrantService } from '../services/grant.service';
import { ViewGrantComponent } from './view-grant/view-grant.component';
import { LatestGrantsComponent } from './latest-grants/latest-grants.component';
import { TrendingGrantsComponent } from './trending-grants/trending-grants.component';
import { ListComponent } from './list/list.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropComponent } from './image-crop/image-crop.component';
import { MyGrantsComponent } from './my-grants/my-grants.component';
import { GrantFundService } from '../services/grantFund.service';
import { PayoutService } from '../services/payout.service';
import { NumberonlyDirectiveModule } from '../common/directives/numberOnlyDirective/numberonlyDirective.module';
import { TagInputModule } from 'ngx-chips';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CreateNewGrantComponent } from './create-new-grant/create-new-grant.component';
import { AmountsReceiveComponent } from './amounts-receive/amounts-receive.component';
import { ViewGrantUnmarkAsCompleteComponent } from './view-grant-unmark-as-complete/view-grant-unmark-as-complete.component';
import { ViewGrantRequestRefundComponent } from './view-grant-request-refund/view-grant-request-refund.component';
import { ViewGrantNotificationsComponent } from './view-grant-notifications/view-grant-notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { GrantDetailsComponent } from './grant-details/grant-details.component';
import { ImageUploadModule } from 'angular2-image-upload';
import { SubgraphService } from '../services/subgraph.service';
import { HeaderComponent } from '../navbar/header/header.component';
import { MenuPopoverComponent } from '../navbar/menu-popover/menu-popover.component';
import { AuthenticationService } from '../services/authentication.service';
import { PayoutComponent } from './payout/payout.component';

const PAGES_COMPONENTS = [
    PagesComponent,
];

@NgModule({
    declarations: [
        HeaderComponent,
        MenuPopoverComponent,
        PagesComponent,
        HomeComponent,
        ListComponent,
        PayoutComponent,
        ProfileComponent,
        ImageCropComponent,
        MyGrantsComponent,
        ViewGrantComponent,
        GrantDetailsComponent,
        LatestGrantsComponent,
        TrendingGrantsComponent,
        CreateNewGrantComponent,
        AmountsReceiveComponent,
        TransactionHistoryComponent,
        ViewGrantRequestRefundComponent,
        ViewGrantNotificationsComponent,
        ViewGrantUnmarkAsCompleteComponent,
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
        PayoutComponent,
        MenuPopoverComponent,
        ViewGrantComponent,
        ImageCropComponent
    ],
    providers: [
        UserService,
        GrantService,
        GrantFundService,
        PayoutService,
        SubgraphService,
        AuthenticationService
    ]
})
export class PagesModule {

}
