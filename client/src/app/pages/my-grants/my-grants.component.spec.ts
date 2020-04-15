import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MyGrantsComponent } from './my-grants.component';

import { GrantService } from 'src/app/services/grant.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../header/header.module';
import { ViewGrantModule } from '../view-grant/view-grant.module';
import { ViewGrantRequestRefundModule } from '../view-grant-request-refund/view-grant-request-refund.module';
import { ViewGrantUnmarkAsCompleteModule } from '../view-grant-unmark-as-complete/view-grant-unmark-as-complete.module';
import { ViewGrantNotificationsModule } from '../view-grant-notifications/view-grant-notifications.module';
import { AmountsReceiveModule } from '../amounts-receive/amounts-receive.module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MyGrantsComponent', () => {
  let component: MyGrantsComponent;
  let fixture: ComponentFixture<MyGrantsComponent>;
  

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        HeaderModule,
        ViewGrantModule,
        HttpClientTestingModule,
        ViewGrantRequestRefundModule,
        ViewGrantUnmarkAsCompleteModule,
        ViewGrantNotificationsModule,
        AmountsReceiveModule,
        RouterModule],
      declarations: [MyGrantsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [GrantService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('GrantServiceshould be created', () => {
  //   const service: GrantService = TestBed.get(GrantService);
  //   expect(service).toBeTruthy();
  // });

  
})

