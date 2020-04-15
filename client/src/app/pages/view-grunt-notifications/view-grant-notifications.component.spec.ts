import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewGruntNotificationsComponent } from './view-grunt-notifications.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


describe('ViewGruntNotificationsComponent', () => {
  let component: ViewGruntNotificationsComponent;
  let fixture: ComponentFixture<ViewGruntNotificationsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
                FormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
                IonicModule],
      declarations: [ViewGruntNotificationsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AuthenticationService, ToastrService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGruntNotificationsComponent);
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

 
  
});