import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';
import { HeaderModule } from '../header/header.module';
import { ResetPasswordModule } from '../reset-password/reset-password.module';
import { ViewGrantModule } from '../view-grant/view-grant.module';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MenuPopoverModule,
        HeaderModule,
        ResetPasswordModule,
        ViewGrantModule,
      ],
      providers: [UserService, ToastrService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('UserService should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});


