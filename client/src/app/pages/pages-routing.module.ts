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
            path: 'view-grunt',
            loadChildren: () => import('./view-grunt/view-grunt.module').then(m => m.ViewGruntModule),
        }, {
            path: 'grant-details',
            loadChildren: () => import('./grant-details/grant-details.module').then(m => m.GrantDetailsModule),
        }, {
            path: 'view-grunt-notifications',
            loadChildren: () => import('./view-grunt-notifications/view-grunt-notifications.module').then(m => m.ViewGruntNotificationsModule),
        }, {
            path: 'view-grunt-request-refund',
            loadChildren: () => import('./view-grunt-request-refund/view-grunt-request-refund.module').then(m => m.ViewGruntRequestRefundModule),
        }, {
            path: 'view-grunt-unmark-as-complete',
            loadChildren: () => import('./view-grunt-unmark-as-complete/view-grunt-unmark-as-complete.module').then(m => m.ViewGruntUnmarkAsCompleteModule),
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