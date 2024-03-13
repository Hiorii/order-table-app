import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;
  let mockAudio: jest.Mocked<HTMLAudioElement>;

  beforeEach(() => {
    mockAudio = {
      play: jest.fn().mockImplementation(() => Promise.resolve()),
      pause: jest.fn(),
      load: jest.fn()
    } as unknown as jest.Mocked<HTMLAudioElement>;

    jest.spyOn(window, 'Audio').mockImplementation(() => mockAudio);

    service = new AudioService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('playAudio should set audio src, call load and play', async () => {
    const audioPath = 'test.mp3';
    service.playAudio(audioPath);
    expect(mockAudio.src).toBe(audioPath);
    expect(mockAudio.load).toHaveBeenCalled();
    expect(mockAudio.play).toHaveBeenCalled();
  });

  it('stopAudio should pause the audio', () => {
    service.stopAudio();
    expect(mockAudio.pause).toHaveBeenCalled();
  });

  it('increaseVolume should not set volume above 1', () => {
    mockAudio.volume = 0.2;
    service.increaseVolume();
    expect(mockAudio.volume).toBeLessThanOrEqual(1);
  });

  it('decreaseVolume should not set volume below 0', () => {
    mockAudio.volume = 0.9;
    service.decreaseVolume();
    expect(mockAudio.volume).toBeGreaterThanOrEqual(0);
  });
});
