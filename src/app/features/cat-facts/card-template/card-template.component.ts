import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { AudioService } from '../../settings/services/audio.service';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrl: './card-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTemplateComponent implements OnDestroy {
  @Input() fact: string;

  constructor(private audioService: AudioService) {}

  ngOnDestroy() {
    window.speechSynthesis.cancel();
  }

  readText(fact: string): void {
    const synth = window.speechSynthesis;
    const trySpeak = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(fact);
        utterance.voice = voices.find((voice) => voice.lang.startsWith('en')) as SpeechSynthesisVoice; // Adjusted to find the first English voice
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;

        this.audioService.decreaseVolume();

        utterance.onend = () => {
          this.audioService.increaseVolume();
        };

        synth.speak(utterance);
      }
    };
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = trySpeak;
    } else {
      trySpeak();
    }
  }
}
