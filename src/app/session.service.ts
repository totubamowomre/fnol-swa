import { HttpResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, timer, Subscription } from 'rxjs';
import { ApiService } from 'src/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  private sessionState = new BehaviorSubject<boolean>(false);
  private sessionReminder = new BehaviorSubject<boolean>(false);
  currentSessionState = this.sessionState.asObservable();
  currentSessionReminder = this.sessionReminder.asObservable();

  private sessionSubscription?: Subscription;
  private sessionReminderSubscription?: Subscription;

  constructor(private apiService: ApiService) {
    // Restore session from sessionStorage
    if (SessionService.isSessionActive()) {
      this.sessionState.next(true);
    }
  }

  private static prefixKey(key: string): string {
    const sessionStoragePrefix = environment.session.storagePrefix;
    return `${sessionStoragePrefix}-${key}`;
  }

  public static setSessionActive(isActive: boolean): void {
    sessionStorage.setItem(this.prefixKey('sessionActive'), JSON.stringify(isActive));
  }

  public static isSessionActive(): boolean {
    const active = sessionStorage.getItem(this.prefixKey('sessionActive'));
    return active ? JSON.parse(active) : false;
  }

  public static setSessionKey(value: string): void {
    sessionStorage.setItem(this.prefixKey('sessionKey'), value);
  }

  public static getSessionKey(): string | null {
    return sessionStorage.getItem(this.prefixKey('sessionKey'));
  }

  public static setSessionData(data: any): void {
    sessionStorage.setItem(this.prefixKey('sessionData'), JSON.stringify(data));
  }

  public static getSessionData(): any {
    const data = sessionStorage.getItem(this.prefixKey('sessionData'));
    return data ? JSON.parse(data) : null;
  }

  public static clearAll(): void {
    // This clears only the prefixed items in the session storage
    Object.keys(sessionStorage)
      .filter(key => key.startsWith(environment.session.storagePrefix))
      .forEach(key => sessionStorage.removeItem(key));
  }

  async startSession(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if there's an existing session key in sessionStorage
      if (SessionService.isSessionActive()) {
        resolve(SessionService.getSessionKey());
      } else {
        this.setSessionState(true);
        const timeOutMinutes = environment.session.timeOut * 60 * 1000;
        const reminderTimeOut = timeOutMinutes * 0.7;

        this.sessionReminderSubscription = timer(reminderTimeOut).subscribe(() => {
          this.sessionReminder.next(true);
        });

        this.sessionSubscription = timer(timeOutMinutes).subscribe(() => {
          this.setSessionState(false);
          SessionService.clearAll();
          console.log('Session ended');
        });
        // create a new empty FNOL to generate a unique session key
        const sessionData = {};
        this.apiService.createFnol(sessionData).subscribe({
          next: (response: HttpResponse<any>) => {
            const locationHeader = response.headers.get('Location');
            const sessionKey = locationHeader?.split('/').pop() || '';
            SessionService.setSessionKey(sessionKey)
            SessionService.setSessionData(sessionData);
            console.log('Session started');
            resolve(sessionKey);
          },
          error: (error: any) => {
            console.error('Error creating Fnol: ', error);
            reject(error)
          }
        });
      }
    });
  }

  private setSessionState(isActive: boolean): void {
    this.sessionState.next(isActive);
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
    this.sessionReminderSubscription?.unsubscribe();
  }
}