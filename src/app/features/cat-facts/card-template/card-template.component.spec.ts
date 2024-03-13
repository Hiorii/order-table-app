import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardTemplateComponent } from './card-template.component';
import { AudioService } from '../../settings/services/audio.service';

global.SpeechSynthesisUtterance = jest.fn().mockImplementation(() => ({
  onend: null
}));
describe('CardTemplateComponent', () => {
  let component: CardTemplateComponent;
  let fixture: ComponentFixture<CardTemplateComponent>;
  let mockAudioService = { decreaseVolume: jest.fn(), increaseVolume: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardTemplateComponent],
      providers: [{ provide: AudioService, useValue: mockAudioService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CardTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call decreaseVolume and increaseVolume on readText', () => {
    const mockSynth = {
      getVoices: () => [{ lang: 'en-US' }],
      cancel: jest.fn(),
      speak: jest.fn().mockImplementation((utterance) => {
        utterance.onend();
      })
    };
    Object.defineProperty(window, 'speechSynthesis', { value: mockSynth });

    component.readText('Hello World');
    expect(mockSynth.cancel).toHaveBeenCalled();
    expect(mockSynth.speak).toHaveBeenCalled();
    expect(mockAudioService.decreaseVolume).toHaveBeenCalled();
    expect(mockAudioService.increaseVolume).toHaveBeenCalled();
  });

  it('should cancel speech synthesis on destroy', () => {
    const cancelSpy = jest.spyOn(window.speechSynthesis, 'cancel');
    component.ngOnDestroy();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
