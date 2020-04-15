import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ResetPasswordComponent } from './reset-password.component';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';



@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [UserService]
})
export class ResetPasswordModule { }
