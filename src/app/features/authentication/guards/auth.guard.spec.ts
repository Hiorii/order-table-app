import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionService } from '../../../shared/services/session.service';
import { AuthGuardService } from './auth.guard';

const mockSessionService = {
  get: jest.fn(),
  set: jest.fn()
};

describe('AuthGuardService', () => {
  let guard: AuthGuardService;
  let router: Router;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
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

    guard = TestBed.inject(AuthGuardService);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow navigation if user is logged in', () => {
    sessionService.get.mockReturnValue(JSON.stringify({ username: 'testUser' }));
    const result = guard.canActivate();
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if user is not logged in', () => {
    sessionService.get.mockReturnValue(null);
    const result = guard.canActivate();
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['authentication/login']);
  });
});
