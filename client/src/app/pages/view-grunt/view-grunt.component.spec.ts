import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewGruntComponent } from './view-grunt.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GrantFundService } from 'src/app/services/grantFund.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { GrantService } from 'src/app/services/grant.service';


class MockNavParams {
  data = {
  };

  get(param) {
    return this.data[param];
  }
}

describe('ViewGruntComponent', () => {
  let component: ViewGruntComponent;
  let fixture: ComponentFixture<ViewGruntComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,
        RouterTestingModule, CommonModule,
        FormsModule,
        IonicModule, HttpClientTestingModule, ToastrModule.forRoot()],
      declarations: [ViewGruntComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AuthenticationService, GrantFundService, GrantService, ToastrService, { provide: NavParams, useClass: MockNavParams },]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGruntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('AuthenticationService be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });

  it('ToastrService be created', () => {
    const service: ToastrService = TestBed.get(ToastrService);
    expect(service).toBeTruthy();
  });

  it('GrantFundService be created', () => {
    const service: GrantFundService = TestBed.get(GrantFundService);
    expect(service).toBeTruthy();
  });

  it('GrantService be created', () => {
    const service: GrantService = TestBed.get(GrantService);
    expect(service).toBeTruthy();
  });


});