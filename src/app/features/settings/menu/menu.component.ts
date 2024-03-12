import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionService } from '../../../shared/services/session.service';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  public userForm: FormGroup;
  public isMusicOn: boolean = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private authenticationService: AuthenticationService,
    private sessionService: SessionService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.createForm();
    this.checkMusicSettings();
  }

  createForm(): void {
    this.userForm = this.fb.group({
      userName: [''],
      sound: [true]
    });
  }

  logout() {
    this.authenticationService.logout();
  }

  toggleMusic(isTurnOn: boolean) {
    const mainMusicThemePath = 'assets/audio/cute.mp3';
    this.sessionService.set('sound', isTurnOn.toString());
    this.isMusicOn = isTurnOn;
    if (isTurnOn) {
      this.audioService.playAudio(mainMusicThemePath);
    } else {
      this.audioService.stopAudio();
    }
  }

  checkMusicSettings(): void {
    const sound = this.sessionService.get('sound');
    this.sessionService.set('sound', sound || 'false');
    this.isMusicOn = sound === 'true';
  }
}
