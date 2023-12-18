import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiredDialogComponent } from './session-expired-dialog.component';
import { MatModule } from 'src/app/material.module';

describe('SessionExpiredDialogComponent', () => {
  let component: SessionExpiredDialogComponent;
  let fixture: ComponentFixture<SessionExpiredDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatModule],
      declarations: [SessionExpiredDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionExpiredDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
