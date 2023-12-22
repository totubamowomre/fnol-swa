import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SessionService } from './session.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SessionService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 seconds
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000; // Reset to default
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start a session', async () => {
    const sessionKey = await service.startSession();
    expect(sessionKey).toBeTruthy();
  });

  it('should set session state to true when starting a session', async () => {
    await service.startSession();
    expect(service.currentSessionState).toBeTruthy();
  });

  it('should set session reminder to true after a certain time', async () => {
    await service.startSession();
    expect(service.currentSessionReminder).toBeTruthy();
  });

  it('should get session data from sessionStorage', () => {
    const sessionDataMock = { key: 'value' };
    const getItemSpy = spyOn(sessionStorage, 'getItem').and.returnValue(
      JSON.stringify(sessionDataMock)
    );

    const result = SessionService.getSessionData();

    expect(getItemSpy).toHaveBeenCalledWith('clmsinsfnoldata-dev-sessionData');
    expect(result).toEqual(sessionDataMock);
  });

  it('should return null if session data is not present in sessionStorage', () => {
    const getItemSpy = spyOn(sessionStorage, 'getItem').and.returnValue(null);

    const result = SessionService.getSessionData();

    expect(getItemSpy).toHaveBeenCalledWith('clmsinsfnoldata-dev-sessionData');
    expect(result).toBeNull();
  });

  it('should reset the timer correctly', fakeAsync(() => {
    const sessionReminderNextSpy = spyOn(service['sessionReminder'], 'next');
    const clearAllSpy = spyOn(SessionService, 'clearAll');
    const consoleLogSpy = spyOn(console, 'log');

    service.resetTimer();

    tick(environment.session.timeOut * 60 * 1000 * 0.7);

    expect(sessionReminderNextSpy).toHaveBeenCalledWith(true);

    tick(environment.session.timeOut * 60 * 1000 * 0.3);

    expect(clearAllSpy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Session ended');
  }));

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    const mockSessionSubscription = new Subscription();
    const mockSessionReminderSubscription = new Subscription();

    service['sessionSubscription'] = mockSessionSubscription;
    service['sessionReminderSubscription'] = mockSessionReminderSubscription;

    const unsubscribeSpy1 = spyOn(mockSessionSubscription, 'unsubscribe');
    const unsubscribeSpy2 = spyOn(
      mockSessionReminderSubscription,
      'unsubscribe'
    );

    service.ngOnDestroy();

    expect(unsubscribeSpy1).toHaveBeenCalled();
    expect(unsubscribeSpy2).toHaveBeenCalled();
  });
});
