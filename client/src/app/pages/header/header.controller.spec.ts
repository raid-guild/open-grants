import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT } from '../../../environments/environment';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GrantService } from 'src/app/services/grant.service';
import { MenuPopoverModule } from '../menu-popover/menu-popover.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;


  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MenuPopoverModule,],
      declarations: [HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [GrantService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('GrantServiceshould be created', () => {
    const service: GrantService = TestBed.get(GrantService);
    expect(service).toBeTruthy();
  });

  it('should call onSearch', async () => {
    const fixture = await TestBed.createComponent(HeaderComponent);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    expect(app).toBeTruthy();
  });

});