import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentsModule } from '../../../shared/components/components.module';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ComponentsModule],
      declarations: [RegisterComponent],
      providers: [
        FormBuilder,
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: SessionService,
          useValue: { get: jest.fn(() => null), set: jest.fn() }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('form valid when correct data is provided', () => {
    fillValidFormData();
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should set userExist to true if username already exists', () => {
    sessionService.get = jest.fn().mockReturnValue(JSON.stringify([{ username: 'existingUser', password: '1234' }]));
    fillValidFormData('existingUser');

    component.register();

    expect(component.userExist).toBe(true);
  });

  it('should navigate to login on successful registration', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    fillValidFormData('newUser');

    component.register();

    expect(navigateSpy).toHaveBeenCalledWith(['authentication/login']);
  });

  function fillValidFormData(username: string = 'testUser') {
    component.registerForm.controls['username'].setValue(username);
    component.registerForm.controls['password'].setValue('1234');
    component.registerForm.controls['passwordRepeat'].setValue('1234');
    fixture.detectChanges();
  }
});
