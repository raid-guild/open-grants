import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { UserService } from 'src/app/services/user.service';

declare let window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  processing = false;
  toastTitle = 'Login';

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {

  }

  // ngAfterViewInit() {
  //   const element = document.querySelector('.navigation');
  //   element.parentNode.removeChild(element);
  // }

  async confirmUser() {
    this.processing = true;

    try {
      if ('enable' in window.web3.currentProvider) {
        await window.web3.currentProvider.enable();
        this.authenticationService.confirmUser({ publicAddress: window.web3.eth.coinbase }).subscribe(async (res: HTTPRESPONSE) => {
          try {
            let signMessage: any = await this.handleSignMessage(res.data)
            this.login(signMessage);
          } catch (error) {
            this.processing = false;
            this.toastr.error(error.message, this.toastTitle);
          }
        }, (err) => {
          this.processing = false;
          this.toastr.error(err.error.message, this.toastTitle);
        });
      }
    } catch (error) {
      this.processing = false;
      this.toastr.error(error.message, this.toastTitle);
    }
  }

  handleSignMessage({ publicAddress, nonce }) {
    return new Promise((resolve, reject) => {
      window.web3.personal.sign(
        window.web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) reject(err);
          resolve({ publicAddress, signature });
        }
      )
    })
  }

  login(signMessage) {
    this.authenticationService.signin({ publicAddress: signMessage.publicAddress, signature: signMessage.signature })
      .subscribe((res: HTTPRESPONSE) => {
        this.toastr.success(res.message, this.toastTitle);
        this.processing = false;
        this.router.navigate(['pages']);
      }, (err) => {
        this.processing = false;
        this.toastr.error(err.error.message, this.toastTitle);
      });
  }

}