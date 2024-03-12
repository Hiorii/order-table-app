import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { IsLoginGuardService } from './is-login.guard';

const mockSessionService = {
  get: jest.fn(),
  set: jest.fn()
};

describe('IsLoginGuardService', () => {
  let guard: IsLoginGuardService;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IsLoginGuardService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: SessionService,
          useValue: mockSessionService
        }
      ]
    });

    guard = TestBed.inject(IsLoginGuardService);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to the home page if the user is already logged in', () => {
    jest.spyOn(sessionService, 'get').mockReturnValue(JSON.stringify({ username: 'testUser' }));
    const result = guard.canActivate();
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow navigation if the user is not logged in', () => {
    jest.spyOn(sessionService, 'get').mockReturnValue(null);
    const result = guard.canActivate();
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
