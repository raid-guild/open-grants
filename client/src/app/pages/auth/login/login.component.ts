import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  processing = false;
  passwordType = false;
  toastTitle = 'Login';
  user = {
    userName: '',
    password: ''
  }

  constructor(public router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  // ngAfterViewInit() {
  //   const element = document.querySelector('.navigation');
  //   element.parentNode.removeChild(element);
  // }

  togglePasswordFieldType() {
    this.passwordType = !this.passwordType;
  }

  onSubmit() {
    this.processing = true;
    this.authenticationService.signin(this.user).subscribe((res: HTTPRESPONSE) => {
      if (res.message) {
        this.processing = false;
        this.toastr.success(res.message, this.toastTitle);
        this.router.navigate(['pages']);
      }
    }, (err) => {
      console.log("err", err);
      this.processing = false;
      this.toastr.error('Error Login. Please try after sometime', this.toastTitle);
    });
  }

  signup() {
    this.router.navigate(['auth/register']);
  }

}