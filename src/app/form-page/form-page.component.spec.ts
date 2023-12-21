import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPageComponent } from './form-page.component';
import { MatModule } from '../material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialogComponent } from '../components/session-expired-dialog/session-expired-dialog.component';

describe('FormPageComponent', () => {
  let component: FormPageComponent;
  let fixture: ComponentFixture<FormPageComponent>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockHistoryState: any;
  let dialog: MatDialog;
  let router: Router;

  beforeEach(async () => {
    mockSessionService = jasmine.createSpyObj('SessionService', {
      isSessionActive: true,
      getSessionKey: 'sessionKey',
      getSessionData: {},
      setSessionData: null,
    });

    mockSessionService.currentSessionReminder = new BehaviorSubject(
      false
    ).asObservable();
    mockSessionService.currentSessionState = new BehaviorSubject(
      false
    ).asObservable();

    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'open']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatModule],
      declarations: [FormPageComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    mockHistoryState = { sessionKey: 'sessionKey' };
    const mockHistory: History = Object.create(window.history, {
      state: { value: mockHistoryState },
    });
    spyOnProperty(window, 'history', 'get').and.returnValue(mockHistory);

    fixture = TestBed.createComponent(FormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);

    spyOn(dialog, 'open').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session key and data if session is active on init', () => {
    component.ngOnInit();
    expect(component['sessionKey']).toBeTruthy();
  });

  it('should format date ', () => {
    const date = new Date('2023-01-01');
    expect(component.formatDate(date)).toBe('01/01/2023');
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

  it('should open session expired dialog and navigate to home on close', () => {
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    (dialog.open as jasmine.Spy).and.returnValue(dialogRefMock);

    dialogRefMock.afterClosed.and.returnValue(of('mockResult'));

    component.openSessionExpiredDialog();

    expect(dialog.open).toHaveBeenCalledWith(SessionExpiredDialogComponent, {});
    expect(dialogRefMock.afterClosed).toHaveBeenCalled();

    dialogRefMock.afterClosed.calls
      .mostRecent()
      .returnValue.subscribe((result: any) => {
        expect(result).toBe('mockResult');
        expect(router.navigate).toHaveBeenCalledWith(['']);
      });
  });

  describe('generateEmailBody', () => {
    it('should generate the email body with complete reporter information', () => {
      const formData = {
        reporter: {
          relationToInsured: 'Relation',
          title: 'Mr.',
          firstName: 'John',
          lastName: 'Doe',
          phone: '123456789',
          email: 'john.doe@example.com',
          addressOne: '123 Main St',
          city: 'City',
          state: 'State',
          country: 'Country',
          customCountry: 'Custom Country',
          postalCode: '12345',
        },
        policy: {
          policyNumber: 'P123456',
          contactSameAsReporter: false,
          title: 'Mrs.',
          firstName: 'Jane',
          lastName: 'Doe',
          phone: '987654321',
          email: 'jane.doe@example.com',
          addressOne: '456 Second St',
          city: 'Another City',
          state: 'Another State',
          country: 'Another Country',
          customCountry: 'Another Custom Country',
          postalCode: '54321',
        },
        loss: {
          date: new Date('2023-01-01'),
          description: 'A loss occurred',
          lossLocation: '',
          lossAddress: {
            addressOne: '456 Second St',
            city: 'Another City',
            state: 'Another State',
            country: 'Another Country',
            customCountry: 'Another Custom Country',
            postalCode: '54321',
          },
          areAuthoritiesNotified: 'Yes',
          anyWitnessOfLoss: 'Yes',
          authorityType: 'Police',
          authorityReportNumber: '123ABC',
          authorityAdditionalInformation: 'Additional info',
          witnesses: [
            {
              title: 'Dr.',
              firstName: 'Witness',
              lastName: 'One',
              email: 'witness.one@example.com',
              phone: '111222333',
              addressOne: '789 Third St',
              city: 'Yet Another City',
              state: 'Yet Another State',
              country: 'Yet Another Country',
              customCountry: 'Yet Another Custom Country',
              postalCode: '98765',
            },
          ],
        },
        claimant: {
          claimants: [
            {
              title: 'Ms.',
              firstName: 'Claimant',
              lastName: 'One',
              email: 'claimant.one@example.com',
              phone: '555666777',
              addressOne: '321 Fourth St',
              city: 'Final City',
              state: 'Final State',
              country: 'Final Country',
              customCountry: 'Final Custom Country',
              postalCode: '43210',
            },
          ],
        },
      };

      const emailBody = component.generateEmailBody(formData);

      expect(emailBody).toContain(
        'Generated by MRSI Claims FNOL Portal - Reference'
      );
      expect(emailBody).toContain('Reported by:');
      expect(emailBody).toContain('Role in Relation to Loss: Relation');
      expect(emailBody).toContain('Title: Mr.');
      expect(emailBody).toContain('First Name: John');
      expect(emailBody).toContain('Last Name: Doe');
      expect(emailBody).toContain('Phone: 123456789');
      expect(emailBody).toContain('Email: john.doe@example.com');
      expect(emailBody).toContain('Address 1: 123 Main St');
      expect(emailBody).toContain('City: City');
      expect(emailBody).toContain('State: State');
      expect(emailBody).toContain('Country: Country');
      expect(emailBody).toContain('Country Name: Custom Country');
      expect(emailBody).toContain('Postal Code: 12345');

      expect(emailBody).toContain('Insured Policy Information:');
      expect(emailBody).toContain('Policy Number: P123456');
      expect(emailBody).toContain('Title: Mrs.');
      expect(emailBody).toContain('First Name: Jane');
      expect(emailBody).toContain('Last Name: Doe');
      expect(emailBody).toContain('Phone: 987654321');
      expect(emailBody).toContain('Email: jane.doe@example.com');
      expect(emailBody).toContain('Address 1: 456 Second St');
      expect(emailBody).toContain('City: Another City');
      expect(emailBody).toContain('State: Another State');
      expect(emailBody).toContain('Country: Another Country');
      expect(emailBody).toContain('Country Name: Another Custom Country');
      expect(emailBody).toContain('Postal Code: 54321');

      expect(emailBody).toContain('Loss Information:');
      expect(emailBody).toContain('Date: 01-01-2023');
      expect(emailBody).toContain('Description: A loss occurred');
      expect(emailBody).toContain('Were Authorities Notified?: Yes');
      expect(emailBody).toContain('Any Witness of Loss: Yes');
      expect(emailBody).toContain('Witness 1:');
      expect(emailBody).toContain('Title: Dr.');
      expect(emailBody).toContain('First Name: Witness');
      expect(emailBody).toContain('Last Name: One');
      expect(emailBody).toContain('Email: witness.one@example.com');
      expect(emailBody).toContain('Phone: 111222333');
      expect(emailBody).toContain('Address 1: 789 Third St');
      expect(emailBody).toContain('City: Yet Another City');
      expect(emailBody).toContain('State: Yet Another State');
      expect(emailBody).toContain('Country: Yet Another Country');
      expect(emailBody).toContain('Country Name: Yet Another Custom Country');
      expect(emailBody).toContain('Postal Code: 98765');

      expect(emailBody).toContain('Claimant Information:');
      expect(emailBody).toContain('Claimant 1:');
      expect(emailBody).toContain('Title: Ms.');
      expect(emailBody).toContain('First Name: Claimant');
      expect(emailBody).toContain('Last Name: One');
      expect(emailBody).toContain('Email: claimant.one@example.com');
      expect(emailBody).toContain('Phone: 555666777');
      expect(emailBody).toContain('Address 1: 321 Fourth St');
      expect(emailBody).toContain('City: Final City');
      expect(emailBody).toContain('State: Final State');
      expect(emailBody).toContain('Country: Final Country');
      expect(emailBody).toContain('Country Name: Final Custom Country');
      expect(emailBody).toContain('Postal Code: 43210');
    });
  });

  it('should fetch session key from sessionStorage when session is active', () => {
    spyOn(SessionService, 'isSessionActive').and.returnValue(true);
    spyOn(SessionService, 'getSessionKey').and.returnValue('fakeSessionKey');
    spyOn(SessionService, 'getSessionData').and.returnValue('fakeSessionData');

    component.ngOnInit();

    expect(SessionService.isSessionActive).toHaveBeenCalled();
    expect(SessionService.getSessionKey).toHaveBeenCalled();
    expect(SessionService.getSessionData).toHaveBeenCalled();
    expect(component.data).toEqual('fakeSessionData');
  });
});
