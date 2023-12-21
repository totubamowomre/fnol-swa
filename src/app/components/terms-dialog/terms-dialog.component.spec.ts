import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsDialogComponent } from './terms-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatModule } from 'src/app/material.module';

describe('TermsDialogComponent', () => {
  let component: TermsDialogComponent;
  let fixture: ComponentFixture<TermsDialogComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<TermsDialogComponent>>;

  beforeEach(async () => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatModule],
      declarations: [TermsDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: mockMatDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with true on accept', () => {
    component.onAccept();
    expect(mockMatDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false on reject', () => {
    component.onReject();
    expect(mockMatDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should open a new window for printing terms', () => {
    const termsContent: HTMLElement = document.createElement('div');
    termsContent.innerHTML = 'Tearms and Conditions';

    const openSpy = spyOn(window, 'open').and.callFake(() => {
      const fakeWindow = {
        document: {
          open: jasmine.createSpy('document.open'),
          write: jasmine.createSpy('document.write'),
          close: jasmine.createSpy('document.close'),
        },
        print: jasmine.createSpy('window.print'),
        close: jasmine.createSpy('window.close'),
      };
      return fakeWindow as unknown as Window;
    });

    component.printTerms(termsContent);

    expect(openSpy).toHaveBeenCalledWith(
      '',
      '_blank',
      'top=0,left=0,height=100%,width=auto'
    );
    expect(
      openSpy.calls.mostRecent().returnValue?.document.open
    ).toHaveBeenCalled();
    expect(
      openSpy.calls.mostRecent().returnValue?.document.write
    ).toHaveBeenCalledWith(jasmine.any(String));
    expect(
      openSpy.calls.mostRecent().returnValue?.document.close
    ).toHaveBeenCalled();
  });
});
