import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentsModule } from '../../../shared/components/components.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ComponentsModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: SessionService,
          useValue: { get: jest.fn(), set: jest.fn() }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('username field validity', () => {
    let username = component.form.controls['username'];
    expect(username.valid).toBeFalsy();

    let errors = username.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('login method should call sessionService.get and router.navigate on success', () => {
    const mockUsers = JSON.stringify([{ username: 'test', password: '1234' }]);
    sessionService.get = jest.fn().mockReturnValue(mockUsers);
    let navigateSpy = jest.spyOn(router, 'navigate');

    component.form.controls['username'].setValue('test');
    component.form.controls['password'].setValue('1234');
    component.login();

    expect(sessionService.get).toHaveBeenCalledWith('users');
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
