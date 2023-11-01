import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionReminderDialogComponent } from './session-reminder-dialog.component';

describe('SessionReminderDialogComponent', () => {
  let component: SessionReminderDialogComponent;
  let fixture: ComponentFixture<SessionReminderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionReminderDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionReminderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
