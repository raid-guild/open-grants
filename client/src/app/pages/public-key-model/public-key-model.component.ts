import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavParams, ModalController } from '@ionic/angular';
import { UserManagementService } from 'src/app/services/user-management.service';
import { EthcontractService } from 'src/app/services/ethcontract.service';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-public-key-model',
  templateUrl: './public-key-model.component.html',
  styleUrls: ['./public-key-model.component.scss'],
})
export class PublicKeyModelComponent implements OnInit {
  @Input() public modal;
  processing = false;
  isAvailable = false;
  accounts = [];
  model = {
    publicKey: '',
  }
  toastTitle = "Private key"
  addresRadio: any;

  constructor(
    public modalCtrl: ModalController,
    private userService: UserService,
    private toastr: ToastrService,
    public router: Router,
    private navParams: NavParams,
    private authService: AuthService,
    private userManagementService: UserManagementService,
    private ethcontractService: EthcontractService,
  ) {
    this.isAvailable = navParams.get('isAvailable');

    (async () => {
      let res = await this.ethcontractService.getAvailableAccount();
      this.accounts.push(res);
      console.log("this.accounts", this.accounts);
    })();
  }

  ngOnInit() { }

  dismiss() {
    if (this.modalCtrl) {
      this.modalCtrl.dismiss()
    }
  }

  onSubmit() {
    this.processing = true;
    // console.log("this",this.privateKey);
    this.userService.updateUser(this.model).subscribe((res: HTTPRESPONSE) => {
      this.processing = false;
      this.userManagementService.setUserData(res.data);
      this.modal.dismiss();
      this.toastr.success("Public Key added successfully");
      this.router.navigate(['pages']);
    }, (err) => {
      this.processing = false;
      this.toastr.error('Error Login. Please try after sometime');
    });
  }

  selectAccount(index: number) {
    this.model.publicKey = this.accounts[index].account;
  }

  signOut() {
    this.authService.logout();
    this.toastr.success("Sign out successfully");
    this.router.navigate(['auth']);
    this.modal.dismiss();
  }

}
