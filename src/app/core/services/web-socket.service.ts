import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  private messageSubject: Subject<any> = new Subject<any>();
  private connectionStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.connectionStateSubject.next(true);
    };

    this.socket.onmessage = (event) => {
      this.messageSubject.next(JSON.parse(event.data));
    };

    this.socket.onclose = () => {
      this.connectionStateSubject.next(false);
      this.messageSubject.complete();
    };
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  getConnectionState(): Observable<boolean> {
    return this.connectionStateSubject.asObservable();
  }

  sendMessage(message: any): void {
    this.socket.send(JSON.stringify(message));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
