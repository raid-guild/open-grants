import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';

// import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
// import { TabsPageComponent } from './tabs-page/tabs-page.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: '',
            redirectTo: 'my-grants', pathMatch: 'full'
        },
        {
            path: 'home',
            loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        }, {
            path: 'list',
            loadChildren: () => import('./list/list.module').then(m => m.ListModule),
        }, {
            path: 'my-grants',
            loadChildren: () => import('./my-grants/my-grants.module').then(m => m.MyGrantsModule),
        }, {
            path: 'latest-grants',
            loadChildren: () => import('./latest-grants/latest-grants.module').then(m => m.LatestGrantsModule),
        }, {
            path: 'create-new-grant',
            loadChildren: () => import('./create-new-grant/create-new-grant.module').then(m => m.CreateNewGrantModule),
        }, {
            path: 'trending-grants',
            loadChildren: () => import('./trending-grants/trending-grants.module').then(m => m.TrendingGrantsModule),
        }, {
            path: 'user-profile',
            loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        }, {
            path: 'transaction-history',
            loadChildren: () => import('./transaction-history/transaction-history.module').then(m => m.TransactionHistoryModule),
        }, {
            path: 'view-grant',
            loadChildren: () => import('./view-grant/view-grant.module').then(m => m.ViewGrantModule),
        }, {
            path: 'grant-details',
            loadChildren: () => import('./grant-details/grant-details.module').then(m => m.GrantDetailsModule),
        }, {
            path: 'view-grant-notifications',
            loadChildren: () => import('./view-grant-notifications/view-grant-notifications.module').then(m => m.ViewGrantNotificationsModule),
        }, {
            path: 'view-grant-request-refund',
            loadChildren: () => import('./view-grant-request-refund/view-grant-request-refund.module').then(m => m.ViewGrantRequestRefundModule),
        }, {
            path: 'view-grant-unmark-as-complete',
            loadChildren: () => import('./view-grant-unmark-as-complete/view-grant-unmark-as-complete.module').then(m => m.ViewGrantUnmarkAsCompleteModule),
        }, {
            path: 'amounts-receive',
            loadChildren: () => import('./amounts-receive/amounts-receive.module').then(m => m.AmountsReceiveModule),
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