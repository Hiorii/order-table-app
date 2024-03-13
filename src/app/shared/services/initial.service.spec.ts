import { InitialService } from './initial.service';
import { AudioService } from '../../features/settings/services/audio.service';
import { SessionService } from './session.service';

describe('InitialService', () => {
  let service: InitialService;
  let audioServiceMock: Partial<AudioService>;
  let sessionServiceMock: jest.Mocked<SessionService>;

  beforeEach(() => {
    audioServiceMock = {
      playAudio: jest.fn(),
      stopAudio: jest.fn(),
      increaseVolume: jest.fn(),
      decreaseVolume: jest.fn()
    };

    sessionServiceMock = {
      set: jest.fn(),
      get: jest.fn().mockReturnValue('true'),
      remove: jest.fn(),
      clear: jest.fn()
    };

    service = new InitialService(audioServiceMock as AudioService, sessionServiceMock);
  });

  it('should play audio if session sound is true', () => {
    sessionServiceMock.get.mockReturnValue('true');

    service.handleMusic();

    expect(audioServiceMock.playAudio).toHaveBeenCalledWith('assets/audio/cute.mp3');
    expect(audioServiceMock.stopAudio).not.toHaveBeenCalled();
  });

  it('should stop audio if session sound is not true', () => {
    sessionServiceMock.get.mockReturnValue('false');

    service.handleMusic();

    expect(audioServiceMock.stopAudio).toHaveBeenCalled();
    expect(audioServiceMock.playAudio).not.toHaveBeenCalled();
  });
});
