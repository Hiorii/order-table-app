import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private volumeStep = 0.85;

  playAudio(audioPath: string): void {
    this.audio.src = audioPath;
    this.audio.load();
    this.audio.loop = true;
    this.audio.play().catch((err) => console.error('Audio playback error:', err));
  }

  stopAudio(): void {
    this.audio.pause();
  }

  increaseVolume(): void {
    this.audio.volume = Math.min(1, this.audio.volume + this.volumeStep);
  }

  decreaseVolume(): void {
    this.audio.volume = Math.max(0, this.audio.volume - this.volumeStep);
  }
}
