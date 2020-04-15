import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HeaderModule } from '../header/header.module';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HeaderModule,
        RouterModule.forChild(routes)
    ],
    declarations: [HomeComponent]
})
export class HomeModule { }