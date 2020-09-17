import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  isLogin = false;
  public appPages = [];
  public unauthenticatedPages = [
    {
      title: 'Latest Grants',
      url: '/pages/latest',
      icon: 'gp-latest-grant',
    },
  ];

  public allPages = [
    {
      title: 'Create New Grants',
      url: '/pages/create',
      icon: 'gp-grant',
    },
    {
      title: 'Latest Grants',
      url: '/pages/latest',
      icon: 'gp-latest-grant',
    },
    {
      title: 'My Grants',
      url: '/pages/my-grants',
      icon: 'gp-grant',
    },
    // {
    //     title: 'User Profile',
    //     url: '/pages/profile',
    //     icon: 'gp-user'
    // },
  ];

  constructor(private authService: AuthService) {
    this.appPages = this.unauthenticatedPages;
  }

  ngOnInit() {
    this.authService.getLoggedIn().subscribe((res: boolean) => {
      this.appPages = res ? this.allPages : this.unauthenticatedPages;
    });
  }
}
