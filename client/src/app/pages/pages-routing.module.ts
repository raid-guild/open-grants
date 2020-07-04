import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { LatestGrantsComponent } from './latest-grants/latest-grants.component';
import { TrendingGrantsComponent } from './trending-grants/trending-grants.component';
import { ProfileComponent } from './profile/profile.component';
import { MyGrantsComponent } from './my-grants/my-grants.component';
import { GrantDetailsComponent } from './grant-details/grant-details.component';
import { CreateNewGrantComponent } from './create-new-grant/create-new-grant.component';
import { GrantComponent } from './grant/grant.component';

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
            path: 'grant/:id',
            component: GrantComponent,
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