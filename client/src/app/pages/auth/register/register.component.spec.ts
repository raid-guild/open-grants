import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule,ToastrModule.forRoot()],
      declarations: [RegisterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AuthenticationService, ToastrService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('RegisterForm', () => {
    spyOn(component.router, 'navigate');
    component.onSubmit();
  })

  it('AuthenticationService be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });

  it('ToastrService be created', () => {
    const service: ToastrService = TestBed.get(ToastrService);
    expect(service).toBeTruthy();
  });
  
});