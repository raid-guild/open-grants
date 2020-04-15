import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { ModalController, NavParams } from '@ionic/angular';
import { AppSettings } from 'src/app/config/app.config';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  processing = false;
  toastTitle = "User";
  userData: any;
  oldPassError = false;
  oldPasswordType = false;
  newPasswordType = false;

  user = {
    oldPassword: "",
    newPassword: '',
    comfirmPassword: ""
  }

  constructor(
    public modalCtrl: ModalController,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router,
  ) {
    this.userData = JSON.parse(localStorage.getItem(AppSettings.localStorage_keys.userData));
  }

  ngOnInit() { }


  dismiss() {
    if (this.modalCtrl) {
      this.modalCtrl.dismiss()
    }
  }

  toggleOldPasswordFieldType() {
    this.oldPasswordType = !this.oldPasswordType
  }

  toggleNewePasswordFieldType() {
    this.newPasswordType = !this.newPasswordType
  }
  
  oldPasswordError() {
    this.oldPassError = false;
  }

  onSubmit() {
    this.processing = true;
    this.userService.changePassword(this.user).subscribe((res: HTTPRESPONSE) => {
      if (res.message) {
        this.processing = false;
        this.dismiss();
        this.toastr.success("Password reset successfully", this.toastTitle);
        this.authService.logout();
        this.router.navigate(['auth']);
      }
    }, (err) => {
      this.processing = false;
      if (err.error.status == 400) {
        this.oldPassError = true;
      }
      this.toastr.error('Some thing went wrong !!', this.toastTitle);
    });
  }
}
