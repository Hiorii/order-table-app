import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrl: './card-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTemplateComponent implements OnDestroy {
  @Input() fact: string;

  ngOnDestroy() {
    window.speechSynthesis.cancel();
  }

  readText(fact: string): void {
    window.speechSynthesis.cancel();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(fact);
      utterance.voice = speechSynthesis.getVoices().filter((voice) => voice.lang === 'en')[0];
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }
}
