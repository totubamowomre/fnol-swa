import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTooLargeDialogComponent } from './email-too-large-dialog.component';

describe('EmailTooLargeDialogComponent', () => {
  let component: EmailTooLargeDialogComponent;
  let fixture: ComponentFixture<EmailTooLargeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTooLargeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailTooLargeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
