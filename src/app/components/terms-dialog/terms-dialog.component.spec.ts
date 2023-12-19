import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsDialogComponent } from './terms-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatModule } from 'src/app/material.module';

describe('TermsDialogComponent', () => {
  let component: TermsDialogComponent;
  let fixture: ComponentFixture<TermsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatModule],
      declarations: [TermsDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
