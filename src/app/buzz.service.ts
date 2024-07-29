import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class BuzzService {
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private usersSubject: BehaviorSubject<{ id: string; name: string; isHost: boolean }[]> = new BehaviorSubject<{ id: string; name: string; isHost: boolean }[]>([]);
  private buzzerEventsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private roomSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private notificationSubject: Subject<string> = new Subject<string>();
  private roomConfigSubject: BehaviorSubject<string> = new BehaviorSubject<string>(''); // New subject for room config

  public message$: Observable<string> = this.messageSubject.asObservable();
  public users$: Observable<{ id: string; name: string; isHost: boolean }[]> = this.usersSubject.asObservable();
  public buzzerEvents$: Observable<any[]> = this.buzzerEventsSubject.asObservable();
  public room$: Observable<string> = this.roomSubject.asObservable();
  public notification$: Observable<string> = this.notificationSubject.asObservable();
  public roomConfig$: Observable<string> = this.roomConfigSubject.asObservable(); // Observable for room config

  public socket: Socket = io('http://localhost:3000');

  constructor() {
    this.socket.on('message', (message: string) => {
      this.messageSubject.next(message);
    });

    this.socket.on('users', (users: { id: string; name: string; isHost: boolean }[]) => {
      this.usersSubject.next(users);
    });

    this.socket.on('buzzer', (event: any) => {
      const events = this.buzzerEventsSubject.value;
      this.buzzerEventsSubject.next([...events, event]);
    });

    this.socket.on('roomCreated', (roomId: string, config: string) => { // Receive room config
      this.roomSubject.next(roomId);
      this.roomConfigSubject.next(config); // Update room config
    });

    this.socket.on('notification', (notification: string) => {
      this.notificationSubject.next(notification);
    });

    this.socket.on('hostLeaveRoomAttempt', (message: string) => {
      alert(message);
    });

    this.socket.on('roomClosed', (message: string) => {
      alert(message);
      window.location.href = '/buzz';
    });

    this.socket.on('currentState', (state: { users: { id: string; name: string; isHost: boolean }[], buzzerEvents: any[] }) => {
      this.usersSubject.next(state.users);
      this.buzzerEventsSubject.next(state.buzzerEvents);
    });
  }

  public sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  public createRoom(buzzMode: 'single' | 'multiple'): void {
    this.socket.emit('createRoom', buzzMode);
  }

  public joinRoom(roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket.emit('joinRoom', roomId, (success: boolean) => {
        if (success) {
          resolve(success);
        } else {
          reject('Failed to join room');
        }
      });
    });
  }

  public pressBuzzer(): void {
    this.socket.emit('buzzer');
  }

  public setName(name: string): void {
    this.socket.emit('setName', name);
  }

  public endEvent(): Promise<void> {
    return new Promise((resolve) => {
      this.socket.emit('endEvent');
      resolve();
    });
  }

  public getNewMessage(): Observable<string> {
    return this.message$;
  }

  public getUsers(): Observable<{ id: string; name: string; isHost: boolean }[]> {
    return this.users$;
  }

  public getBuzzerEvents(): Observable<any[]> {
    return this.buzzerEvents$;
  }

  public getRoom(): Observable<string> {
    return this.room$;
  }

  public getNotifications(): Observable<string> {
    return this.notification$;
  }

  public getRoomConfig(): Observable<string> {
    return this.roomConfig$; // Return the observable for room config
  }

  public isValidRoom(roomId: string): Observable<boolean> {
    const isValid = !!roomId && roomId.length > 3;
    return of(isValid);
  }

  public leaveRoom(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('leaveRoom', (response: string) => {
        if (response === 'success') {
          resolve();
        } else {
          reject('Failed to leave room');
        }
      });
    });
  }

  public closeRoom(): void {
    this.socket.emit('closeRoom');
  }
}
