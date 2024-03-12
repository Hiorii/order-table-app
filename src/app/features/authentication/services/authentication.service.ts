import { Injectable } from '@angular/core';
import { SessionService } from '../../../shared/services/session.service';
import { Router } from '@angular/router';
import { AudioService } from '../../settings/services/audio.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private audioService: AudioService
  ) {}

  logout() {
    this.sessionService.remove('currentUser');
    this.router.navigate(['/authentication/login']);
    this.audioService.stopAudio();
  }
}
