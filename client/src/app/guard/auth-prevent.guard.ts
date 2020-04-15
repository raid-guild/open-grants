import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class AuthPreventGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean {
        if (AuthService.isAuthenticated()) {
            this.router.navigate(['/']);
            return false;
        } else {
            return true;
        }
    }
}