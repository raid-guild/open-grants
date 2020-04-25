import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (AuthService.isAuthenticated()) {
            return true;
        }

        this.router.navigate(['pages/dashboard'], { queryParams: { redirect: state.url }, replaceUrl: true });
        return false;
    }
}
