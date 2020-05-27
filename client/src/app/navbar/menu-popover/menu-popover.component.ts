import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-popover',
  templateUrl: './menu-popover.component.html',
  styleUrls: ['./menu-popover.component.scss'],
})
export class MenuPopoverComponent implements OnInit {

  toastTitle = "User";

  constructor(
    public router: Router,
    private toastr: ToastrService,
    public popoverCtrl: PopoverController,
    private authService: AuthService
    ) { }

  ngOnInit() { }

  dismiss() {
    this.popoverCtrl.dismiss()
  }

  signOut() {
    this.authService.logout();
    this.toastr.success("Sign out successfully", this.toastTitle);
    this.router.navigate(['pages/home']);
    this.dismiss();
  }

  profile() {
    this.router.navigate(['pages/profile']);
    this.dismiss();
  }


}

