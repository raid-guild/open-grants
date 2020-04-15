import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthService } from 'src/app/services/auth.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [LoginComponent, RegisterComponent],

    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientModule,
        RouterModule.forChild(routes),
    ],

    providers: [AuthenticationService, AuthService]
})
export class AuthModule { }
