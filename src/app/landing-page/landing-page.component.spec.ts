import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatModule } from '../material.module';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { of } from 'rxjs';
import { TermsDialogComponent } from '../components/terms-dialog/terms-dialog.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSessionService = jasmine.createSpyObj('SessionService', [
      'startSession',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatModule,
        MatDialogModule,
        RouterTestingModule,
      ],
      declarations: [LandingPageComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openTermsDialog', () => {
    it('should open terms dialog and update isStartButtonEnabled on dialog close', () => {
      const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
      mockDialog.open.and.returnValue(dialogRefSpyObj);

      component.openTermsDialog({ preventDefault: () => {} });

      expect(mockDialog.open).toHaveBeenCalledWith(TermsDialogComponent, {});
      expect(dialogRefSpyObj.afterClosed).toHaveBeenCalledOnceWith();
      expect(component.isStartButtonEnabled).toBe(true);
    });
  });

  describe('onStartButtonClick', () => {
    it('should clear session, start a new session, and navigate to /form', async () => {
      const sessionKey = 'fakeSessionKey';
      mockSessionService.startSession.and.resolveTo(sessionKey);

      await component.onStartButtonClick();

      expect(mockSessionService.startSession).toHaveBeenCalledOnceWith();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/form'], {
        state: { sessionKey },
      });
    });

    it('should throw an error if starting the session fails', async () => {
      const error = new Error('Failed to start session');
      mockSessionService.startSession.and.rejectWith(error);

      await expectAsync(component.onStartButtonClick()).toBeRejectedWithError(
        /Failed to start session/
      );
    });
  });
});
