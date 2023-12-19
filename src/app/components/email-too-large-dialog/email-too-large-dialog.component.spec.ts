import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTooLargeDialogComponent } from './email-too-large-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('EmailTooLargeDialogComponent', () => {
  let component: EmailTooLargeDialogComponent;
  let fixture: ComponentFixture<EmailTooLargeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatModule],
      declarations: [EmailTooLargeDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { emailBody: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTooLargeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
