import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { EditorModule } from '@tinymce/tinymce-angular';

import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CreateNewGrantComponent } from './create-new-grant.component';
import { GrantService } from 'src/app/services/grant.service';
import { UserService } from 'src/app/services/user.service';
import { HeaderModule } from '../header/header.module';
import { NumberonlyDirectiveModule } from '../../common/directives/numberOnlyDirective/numberonlyDirective.module';

const routes: Routes = [
    {
        path: '',
        component: CreateNewGrantComponent
    }
];

@NgModule({
    declarations: [CreateNewGrantComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientModule,
        ReactiveFormsModule,
        HeaderModule,
        TagInputModule,
        EditorModule,
        NumberonlyDirectiveModule,
        RouterModule.forChild(routes)
    ],
    providers: [GrantService, UserService]
})
export class CreateNewGrantModule { }
