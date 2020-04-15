import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { AuthPreventGuard } from './guard/auth-prevent.guard';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: './pages/auth/auth.module#AuthModule',
    canActivate: [AuthPreventGuard],
    data: { preload: true, delay: true }
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled'
  /*preloadingStrategy: AppPreloadingStrategy*/
};

@NgModule({
  imports: [
    RouterModule.forRoot(routes, config)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
