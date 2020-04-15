import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  processing = false;
  passwordType = false;
  toastTitle = 'Signup';
  user = {
    firstName: 'demo',
    lastName: 'demo',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  constructor(public router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  togglePasswordFieldType() {
    this.passwordType = !this.passwordType;
  }

  login() {
    this.router.navigate(['auth/login']);
  }

  onSubmit() {
    this.processing = true;
    // delete this.user.confirmPassword;
    this.authenticationService.signup(this.user).subscribe((res: HTTPRESPONSE) => {
      if (res.message) {
        this.processing = false;
        this.toastr.success(res.message, this.toastTitle);
      }
      this.router.navigate(['auth/login']);
    }, (err) => {
      this.processing = false;
      this.toastr.error('Error registeration. Please try after sometime', this.toastTitle);
    });
  }

}