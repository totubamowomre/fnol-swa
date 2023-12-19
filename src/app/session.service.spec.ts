import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
});
