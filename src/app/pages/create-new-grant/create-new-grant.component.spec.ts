import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateNewGrantComponent } from './create-new-grant.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { GrantService } from 'src/app/services/grant.service';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateNewGrantComponent', () => {
  let component: CreateNewGrantComponent;
  let fixture: ComponentFixture<CreateNewGrantComponent>;
  

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule,
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TagInputModule, HttpClientTestingModule,ToastrModule.forRoot()],
      declarations: [CreateNewGrantComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AuthenticationService, ToastrService,
                  GrantService,UserService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewGrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('myForm', () => {
    spyOn(component.router, 'navigate');
    component.onSubmit();
  })

  it('GrantServiceshould be created', () => {
    const service: GrantService = TestBed.get(GrantService);
    expect(service).toBeTruthy();
  });

  it('UserService be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('AuthenticationService be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });

  it('ToastrService be created', () => {
    const service: ToastrService = TestBed.get(ToastrService);
    expect(service).toBeTruthy();
  });

});