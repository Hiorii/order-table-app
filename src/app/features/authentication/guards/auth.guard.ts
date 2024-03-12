import { CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { SessionService } from '../../../shared/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  canActivate(): boolean {
    const isLoggedIn = !!this.sessionService.get('currentUser');

    if (!isLoggedIn) {
      this.router.navigate(['authentication/login']);
      return false;
    }

    return true;
  }
}

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthGuardService);
  return authService.canActivate();
};
