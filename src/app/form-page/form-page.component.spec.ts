import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPageComponent } from './form-page.component';
import { MatModule } from '../material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

describe('FormPageComponent', () => {
  let component: FormPageComponent;
  let fixture: ComponentFixture<FormPageComponent>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockHistoryState: any;

  beforeEach(async () => {
    mockSessionService = jasmine.createSpyObj('SessionService', {
      isSessionActive: true,
      getSessionKey: 'sessionKey',
      getSessionData: {},
      setSessionData: null
    });

    mockSessionService.currentSessionReminder = new BehaviorSubject(false).asObservable();
    mockSessionService.currentSessionState = new BehaviorSubject(false).asObservable();

    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'open']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatModule],
      declarations: [FormPageComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    mockHistoryState = { sessionKey: 'sessionKey' };
    const mockHistory: History = Object.create(window.history, {
      state: { value: mockHistoryState }
    });
    spyOnProperty(window, 'history', 'get').and.returnValue(mockHistory);

    fixture = TestBed.createComponent(FormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session key and data if session is active on init', () => {
    component.ngOnInit();
    expect(component['sessionKey']).toBeTruthy();
  });

  it('should format date in US format', () => {
    const date = new Date('2023-01-01');
    expect(component.formatDateUS(date)).toBe('01-01-2023');
  });

  it('should indent text correctly', () => {
    const text = 'line1\nline2';
    const indentedText = component.indentText(text, 4);
    expect(indentedText).toBe('line1\n    line2');
  });
});
