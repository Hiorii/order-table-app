import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { QuotesSubscribedMessage } from '../models/web-sockets/quotes-subscribed-message.model';
import { SubscribeMessage } from '../models/web-sockets/subscribe-message.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  private messageSubject: Subject<QuotesSubscribedMessage> = new Subject<QuotesSubscribedMessage>();
  private connectionStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.connectionStateSubject.next(true);
    };

    this.socket.onmessage = (event) => {
      const message: QuotesSubscribedMessage = JSON.parse(event.data);
      this.messageSubject.next(message);
    };

    this.socket.onclose = () => {
      this.connectionStateSubject.next(false);
      this.messageSubject.complete();
    };
  }

  getMessages(): Observable<QuotesSubscribedMessage> {
    return this.messageSubject.asObservable();
  }

  getConnectionState(): Observable<boolean> {
    return this.connectionStateSubject.asObservable();
  }

  sendMessage(message: SubscribeMessage): void {
    this.socket.send(JSON.stringify(message));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
