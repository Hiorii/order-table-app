import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './web-socket.service';
import { QuotesSubscribedMessage } from '../models/web-sockets/quotes-subscribed-message.model';
import { SubscribeMessage } from '../models/web-sockets/subscribe-message.model';
import { first } from 'rxjs/operators';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockWebSocket: WebSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);

    mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      onopen: null,
      onmessage: null,
      onclose: null
    } as any as WebSocket;

    (window as any).WebSocket = jest.fn(() => mockWebSocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should connect to the WebSocket', () => {
    service.connect('ws://localhost:8080');
    expect(window.WebSocket).toHaveBeenCalledWith('ws://localhost:8080');
  });

  it('should handle WebSocket message event', (done) => {
    const mockMessage: QuotesSubscribedMessage = {
      p: '/quotes/subscribed',
      d: [
        { s: 'BTCUSD', b: 67213.0, a: 67258.85, t: 1718112011 },
        { s: 'ETHUSD', b: 3538.45, a: 3542.87, t: 1718112011 }
      ]
    };

    service
      .getMessages()
      .pipe(first())
      .subscribe((message) => {
        expect(message).toEqual(mockMessage);
        done();
      });

    service.connect('ws://localhost:8080');
    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage({ data: JSON.stringify(mockMessage) } as MessageEvent);
    }
  });

  it('should handle WebSocket close event', (done) => {
    service
      .getConnectionState()
      .pipe(first())
      .subscribe((isOpen) => {
        expect(isOpen).toBe(false);
        done();
      });

    service.connect('ws://localhost:8080');
    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }
    if (mockWebSocket.onclose) {
      const closeEvent = new CloseEvent('close', {
        wasClean: true,
        code: 1000,
        reason: 'Normal closure'
      });
      mockWebSocket.onclose(closeEvent);
    }
  });

  it('should send messages through the WebSocket', () => {
    const message: SubscribeMessage = { p: '/subscribe/addlist', d: ['BTCUSD', 'ETHUSD'] };

    service.connect('ws://localhost:8080');
    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }

    service.sendMessage(message);
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(message));
  });

  it('should close the WebSocket connection', () => {
    service.connect('ws://localhost:8080');
    service.disconnect();
    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
