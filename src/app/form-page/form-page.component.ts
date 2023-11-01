import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialogComponent } from '../components/session-expired-dialog/session-expired-dialog.component';
import { SessionReminderDialogComponent } from '../components/session-reminder-dialog/session-reminder-dialog.component';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  private fnolId!: string | null;
  data!: any;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.sessionService.currentSessionReminder.subscribe(shouldRemind => {
      if (shouldRemind && this.dialog.openDialogs.length === 0) {
        this.openSessionReminderDialog();
      }
    });

    this.sessionService.currentSessionState.subscribe(isActive => {
      if (!isActive && this.dialog.openDialogs.length === 0) {
        this.openSessionExpiredDialog();
      }
    });
  }

  openSessionReminderDialog(): void {
    this.dialog.open(SessionReminderDialogComponent, {
    });
  }

  openSessionExpiredDialog(): void {
    this.dialog.open(SessionExpiredDialogComponent, {
    }).afterClosed().subscribe(_result => {
      if (this.router.url === '/form') {
        this.router.navigate(['']);
      }
    });
  }

  handleFormSubmit(data: any) {
    if (!this.fnolId) {
      throw new Error('Invalid FNOL ID');
    }

    this.apiService.updateFnol(this.fnolId, data).subscribe({
      next: () => {
        this.data = data;
        SessionService.setSessionData(data);
        this.router.navigate(['/confirmation'], { state: { fnolId: this.fnolId } });
      },
      error: (error: any) => {
        console.error("Error updating Fnol:", error);
        throw error;
      }
    });
  }

  ngOnInit(): void {
    // Fetch session key from sessionStorage if available
    if (SessionService.isSessionActive()) {
      this.fnolId = SessionService.getSessionKey();
      this.data = SessionService.getSessionData();
    } else {
      this.fnolId = history.state.sessionKey;
    }
  }
}