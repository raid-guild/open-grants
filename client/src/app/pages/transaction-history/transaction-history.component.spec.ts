import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionHistoryComponent } from './transaction-history.component';

import { GrantService } from 'src/app/services/grant.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../header/header.module';
import { RouterModule } from '@angular/router';
import { GrantFundService } from 'src/app/services/grantFund.service';
import { ToastrService } from 'ngx-toastr';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;


  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientTestingModule,
        HeaderModule,
        RouterModule],
      declarations: [TransactionHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [GrantFundService, ToastrService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('GrantFundService should be created', () => {
    const service: GrantFundService = TestBed.get(GrantFundService);
    expect(service).toBeTruthy();
  });

})

