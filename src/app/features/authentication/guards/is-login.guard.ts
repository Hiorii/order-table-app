import { CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { SessionService } from '../../../shared/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuardService {
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) {}

  canActivate(): boolean {
    const isLoggedIn = !!this.sessionService.get('currentUser');

    if (isLoggedIn) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}

export const IsLoginGuard: CanActivateFn = () => {
  const isLoginService = inject(IsLoginGuardService);
  return isLoginService.canActivate();
};
