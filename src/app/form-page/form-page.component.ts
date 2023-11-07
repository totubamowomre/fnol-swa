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
  styleUrls: ['./form-page.component.scss'],
})
export class FormPageComponent implements OnInit {
  private sessionKey!: string | null;
  data!: any;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.sessionService.currentSessionReminder.subscribe(shouldRemind => {
      if (shouldRemind && this.dialog.openDialogs.length === 0 && this.router.url === '/form') {
        this.openSessionReminderDialog();
      }
    });

    this.sessionService.currentSessionState.subscribe(isActive => {
      if (!isActive && this.dialog.openDialogs.length === 0 && this.router.url === '/form') {
        this.openSessionExpiredDialog();
      }
    });
  }

  openSessionReminderDialog(): void {
    this.dialog.open(SessionReminderDialogComponent, {});
  }

  openSessionExpiredDialog(): void {
    this.dialog
      .open(SessionExpiredDialogComponent, {})
      .afterClosed()
      .subscribe(_result => {
        this.router.navigate(['']);
      });
  }

  handleFormSubmit(data: any) {
    if (!this.sessionKey) {
      throw new Error('Invalid FNOL ID');
    }
    this.data = data;
    SessionService.setSessionData(data);
    let fnolId = this.sessionKey;

    const emailLink = this.constructEmailLink(data);
    // Open the default mail client
    window.open(emailLink, '_blank');

    // Delay the navigation for 2 seconds to give user time to see email client
    setTimeout(() => {
      this.apiService.updateFnol(fnolId, data).subscribe({
        next: () => {
          this.router.navigate(['/confirmation'], { state: { fnolId: fnolId } });
        },
        error: (error: any) => {
          console.error('Error updating Fnol:', error);
          throw error;
        },
      });
    }, 2000);
  }


  constructEmailLink(formData: any): string {
    // You can iterate over formData here to build the body text for the email
    let emailBody = `Role in Relation to Loss: ${formData.reporter.relationToInsured}\n`;
    emailBody += `Title: ${formData.reporter.title}\n`;
    emailBody += `First Name: ${formData.reporter.firstName}\n`;
    emailBody += `Last Name: ${formData.reporter.lastName}\n`;
    emailBody += `Phone: ${formData.reporter.phone}\n`;
    emailBody += `Email: ${formData.reporter.email}\n`;
    emailBody += `Portal Reference: ${this.sessionKey}\n`;

    // Create the mailto link
    const subject = encodeURIComponent('FNOL Portal - New Submission');
    emailBody = encodeURIComponent(emailBody);

    return `mailto:clmins@muninchre.com?subject=${subject}&body=${emailBody}`;
  }

  ngOnInit(): void {
    // Fetch session key from sessionStorage if available
    if (SessionService.isSessionActive()) {
      this.sessionKey = SessionService.getSessionKey();
      this.data = SessionService.getSessionData();
    } else {
      this.sessionKey = history.state.sessionKey;
    }
  }
}
