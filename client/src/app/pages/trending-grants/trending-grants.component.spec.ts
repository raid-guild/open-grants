import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TrendingGrantsComponent } from './trending-grants.component';

import { GrantService } from 'src/app/services/grant.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../header/header.module';
import { RouterModule } from '@angular/router';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';

describe('TrendingGrantsComponent', () => {
  let component: TrendingGrantsComponent;
  let fixture: ComponentFixture<TrendingGrantsComponent>;
  

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        HeaderModule,
        HttpClientTestingModule,
        MenuPopoverModule,
        RouterModule],
      declarations: [TrendingGrantsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [GrantService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingGrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('GrantService should be created', () => {
    const service: GrantService = TestBed.get(GrantService);
    expect(service).toBeTruthy();
  });

  
})

