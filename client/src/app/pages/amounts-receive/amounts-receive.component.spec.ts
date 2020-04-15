import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { AmountsReceiveComponent } from './amounts-receive.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('AmountsReceiveComponent', () => {
  let component: AmountsReceiveComponent;
  let fixture: ComponentFixture<AmountsReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[FormsModule,ReactiveFormsModule,RouterTestingModule,HttpClientTestingModule],
      declarations: [ AmountsReceiveComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountsReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    it('should create', () => {
        expect(component).toBeTruthy();
      });
  });

  



});
