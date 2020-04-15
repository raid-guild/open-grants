import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LatestGrantsComponent } from './latest-grants.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from '../header/header.module';
import { RouterModule } from '@angular/router';
import { GrantService } from 'src/app/services/grant.service';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';
import { ViewGruntModule } from '../view-grunt/view-grunt.module';

describe('LatestGrantsComponent', () => {
  let component: LatestGrantsComponent;
  let fixture: ComponentFixture<LatestGrantsComponent>;
  

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        MenuPopoverModule,
        HeaderModule,
        HttpClientModule,
        ViewGruntModule,
        RouterModule],
      declarations: [LatestGrantsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [GrantService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestGrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('GrantService should be created', () => {
    debugger
    const service: GrantService = TestBed.get(GrantService);
    expect(service).toBeTruthy();
  });
  
})

