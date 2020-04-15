import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let spySortService = jasmine.createSpyObj({ userName:'admin',password:'admin' });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule,ToastrModule.forRoot()],
      declarations: [LoginComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ToastrService,{ provide: AuthenticationService, useValue: spySortService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loginform', () => {
    spyOn(component.router, 'navigate');
    component.signup();
  })

  it('AuthenticationService be created', () => {
    const service: AuthenticationService = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });

  it('ToastrService be created', () => {
    const service: ToastrService = TestBed.get(ToastrService);
    expect(service).toBeTruthy();
  });

//   it('getSortData() should call SortService sortNumberData() method', () => {
//     fixture.detectChanges();
//     component.onSubmit();
//     expect(spySortService.sortNumberData.toHaveBeenCalled(spySortService));
// });

  
});