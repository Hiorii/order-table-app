import { Injectable } from '@angular/core';
import { AudioService } from '../../features/settings/services/audio.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class InitialService {
  constructor(
    private audioService: AudioService,
    private sessionService: SessionService
  ) {}

  handleMusic(): void {
    const sound = this.sessionService.get('sound');
    const mainMusicThemePath = 'assets/audio/cute.mp3';
    if (sound === 'true') {
      this.audioService.playAudio(mainMusicThemePath);
    } else {
      this.audioService.stopAudio();
    }
  }
}
