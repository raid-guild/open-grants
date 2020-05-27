import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { LatestGrantsComponent } from './latest-grants/latest-grants.component';
import { TrendingGrantsComponent } from './trending-grants/trending-grants.component';
import { ListComponent } from './list/list.component';
import { ProfileComponent } from './profile/profile.component';
import { MyGrantsComponent } from './my-grants/my-grants.component';
import { GrantDetailsComponent } from './grant-details/grant-details.component';
import { CreateNewGrantComponent } from './create-new-grant/create-new-grant.component';
import { AmountsReceiveComponent } from './amounts-receive/amounts-receive.component';
import { ViewGrantUnmarkAsCompleteComponent } from './view-grant-unmark-as-complete/view-grant-unmark-as-complete.component';
import { ViewGrantRequestRefundComponent } from './view-grant-request-refund/view-grant-request-refund.component';
import { ViewGrantNotificationsComponent } from './view-grant-notifications/view-grant-notifications.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

// import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
// import { TabsPageComponent } from './tabs-page/tabs-page.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: '',
            redirectTo: 'dashboard', pathMatch: 'full'
        },
        {
            path: 'dashboard',
            component: HomeComponent
        }, {
            path: 'latest',
            component: LatestGrantsComponent
        }, {
            path: 'trending',
            component: TrendingGrantsComponent
        }, {
            path: 'list',
            component: ListComponent
        }, {
            path: 'grant/:id',
            component: GrantDetailsComponent,
        }, {
            path: 'profile',
            component: ProfileComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'my-grants',
            component: MyGrantsComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'create',
            component: CreateNewGrantComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'transaction-history',
            component: TransactionHistoryComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'view-grant-notifications',
            component: ViewGrantNotificationsComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'view-grant-request-refund',
            component: ViewGrantRequestRefundComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'view-grant-unmark-as-complete',
            component: ViewGrantUnmarkAsCompleteComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'amounts-receive',
            component: AmountsReceiveComponent,
            canActivate: [AuthGuard]
        },
        // {
        //     path: '**',
        //     component: NotFoundComponent,
        //     data: { title: '404' },
        // }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}