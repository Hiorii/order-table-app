import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { SessionService } from '../../../shared/services/session.service';
import { AudioService } from '../services/audio.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authenticationServiceMock: Partial<AuthenticationService>;
  let sessionServiceMock: Partial<SessionService>;
  let audioServiceMock: Partial<AudioService>;

  beforeEach(async () => {
    authenticationServiceMock = {
      logout: jest.fn()
    };

    sessionServiceMock = {
      get: jest.fn(),
      set: jest.fn()
    };

    audioServiceMock = {
      playAudio: jest.fn(),
      stopAudio: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [MenuComponent],
      providers: [
        FormBuilder,
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: AudioService, useValue: audioServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and check music settings on ngOnInit', () => {
    jest.spyOn(component, 'createForm');
    jest.spyOn(component, 'checkMusicSettings');

    component.ngOnInit();

    expect(component.createForm).toHaveBeenCalled();
    expect(component.checkMusicSettings).toHaveBeenCalled();
    expect(component.userForm).toBeDefined();
  });

  it('should setup user form correctly', () => {
    component.createForm();
    expect(component.userForm.value).toEqual({
      userName: '',
      sound: true
    });
  });

  it('should call logout from AuthenticationService', () => {
    component.logout();
    expect(authenticationServiceMock.logout).toHaveBeenCalled();
  });

  it('should toggle music on and interact with session and audio services', () => {
    const mainMusicThemePath = 'assets/audio/cute.mp3';
    component.toggleMusic(true);
    expect(sessionServiceMock.set).toHaveBeenCalledWith('sound', 'true');
    expect(audioServiceMock.playAudio).toHaveBeenCalledWith(mainMusicThemePath);
    expect(component.isMusicOn).toBe(true);
  });

  it('should toggle music off and interact with session and audio services', () => {
    component.toggleMusic(false);
    expect(sessionServiceMock.set).toHaveBeenCalledWith('sound', 'false');
    expect(audioServiceMock.stopAudio).toHaveBeenCalled();
    expect(component.isMusicOn).toBe(false);
  });
});
