import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationPageComponent } from './confirmation-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatModule } from '../material.module';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

describe('ConfirmationPageComponent', () => {
  let component: ConfirmationPageComponent;
  let fixture: ComponentFixture<ConfirmationPageComponent>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockHistoryState: any;

  beforeEach(async () => {
    mockSessionService = jasmine.createSpyObj('SessionService', ['startSession']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'open']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatModule],
      declarations: [ConfirmationPageComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    mockHistoryState = { fnolId: '123', emailBody: 'test email body', emailLink: 'test link' };
    const mockHistory: History = Object.create(window.history, {
      state: { value: mockHistoryState }
    });
    spyOnProperty(window, 'history', 'get').and.returnValue(mockHistory);

    fixture = TestBed.createComponent(ConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home page if fnolId is not provided', () => {
    mockHistoryState.fnolId = null;
    fixture = TestBed.createComponent(ConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();
    expect((component as any).router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should hide button if data length is less than or equal to 2000', () => {
    component.data = 'Lorem ipsum dolor sit amet';
    component.ngOnInit();
    expect(component.hideButton).toBeTrue();
  });

  it('should format date in US format', () => {
    const date = new Date('2022-01-01');
    component.formatDateUS(date);
    expect(component.RefDate).toBe('01-01-2022_');
  });

  it('should download text file', () => {
    const mockBlob = new Blob(['test data'], { type: 'text/plain' });
    spyOn(window, 'Blob').and.returnValue(mockBlob);
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:testurl');

    const mockAnchor = document.createElement('a');
    spyOn(document, 'createElement').and.returnValue(mockAnchor);
    spyOn(document.body, 'appendChild').and.callThrough();
    spyOn(document.body, 'removeChild').and.callThrough();

    component.data = 'Lorem ipsum dolor sit amet';
    component.downloadText();

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
    expect(mockAnchor.href).toBe('blob:testurl');
  });

  it('should clear session and navigate to form page', async () => {
    await component.onCreateAdditionalFnolButtonClick();
    expect(component['sessionService'].startSession).toHaveBeenCalled();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/form'], { state: { sessionKey: undefined } });
  });

  it('should open email link in a new tab', () => {
    spyOn(window, 'open');
    component.emailLink = 'https://example.com';
    component.regenerateEmail();
    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
  });
});