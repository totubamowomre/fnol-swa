import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Use BehaviorSubject to track the session state
  private sessionState = new BehaviorSubject<boolean>(false);
  currentSessionState = this.sessionState.asObservable();

  constructor() { }

  startSession(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Generate a unique session key
      const sessionKey = uuidv4();
      this.setSessionState(true);
      const thirtyMinutes = 30 * 60 * 1000;
      timer(thirtyMinutes).subscribe(() => {
        console.log('Session ended: ' + sessionKey);
        this.setSessionState(false);
      });
      resolve(sessionKey);
      console.log('Session started: ' + sessionKey);
    });
  }

  private setSessionState(isActive: boolean): void {
    this.sessionState.next(isActive);
  }
}
