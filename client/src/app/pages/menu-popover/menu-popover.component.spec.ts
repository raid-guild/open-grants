import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuPopoverComponent } from './menu-popover.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GrantService } from 'src/app/services/grant.service';
import { ToastrService } from 'ngx-toastr';

describe('MenuPopoverComponent', () => {
  let component: MenuPopoverComponent;
  let fixture: ComponentFixture<MenuPopoverComponent>;


  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientModule,
        RouterModule],
      declarations: [MenuPopoverComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [GrantService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPopoverComponent);
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

