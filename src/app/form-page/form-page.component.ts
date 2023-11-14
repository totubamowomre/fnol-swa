import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialogComponent } from '../components/session-expired-dialog/session-expired-dialog.component';
import { SessionReminderDialogComponent } from '../components/session-reminder-dialog/session-reminder-dialog.component';
import { environment } from 'src/environments/environment';

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

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  indentDescription(description: string): string {
    return description.split('\n').join('\n                       ');
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
      this.router.navigate(['/confirmation'], { state: { fnolId: fnolId } });
    }, 2000);
  }


  constructEmailLink(formData: any): string {
    let emailBody = `Portal Reference: ${this.sessionKey}\n`;
    emailBody += `\n`;
    emailBody += `Reported by:\n`;
    emailBody += `   Role in Relation to Loss: ${formData.reporter.relationToInsured}\n`;
    emailBody += `   Title: ${formData.reporter.title}\n`;
    emailBody += `   First Name: ${formData.reporter.firstName}\n`;
    emailBody += `   Last Name: ${formData.reporter.lastName}\n`;
    emailBody += `   Phone: ${formData.reporter.phone}\n`;
    emailBody += `   Email: ${formData.reporter.email}\n`;
    emailBody += `   Address 1: ${formData.reporter.addressOne}\n`;
    emailBody += `   Address 2: ${formData.reporter.addressTwo}\n`;
    emailBody += `   City: ${formData.reporter.city}\n`;
    emailBody += `   State/Province: ${formData.reporter.state}\n`;
    emailBody += `   Country: ${formData.reporter.country}\n`;
    emailBody += `   Zip/Postal Code: ${formData.reporter.postalCode}\n`;
    emailBody += `\n`;
    emailBody += `Insured Policy Information:\n`;
    emailBody += `   Policy Number: ${formData.policy.policyNumber}\n`;
    if (formData.policy.contactSameAsReporter) {
      emailBody += `   Same Contact and Address as Reported by: Yes\n`;
    } else {
      emailBody += `   Title: ${formData.policy.title}\n`;
      emailBody += `   First Name: ${formData.policy.firstName}\n`;
      emailBody += `   Last Name: ${formData.policy.lastName}\n`;
      emailBody += `   Phone: ${formData.policy.phone}\n`;
      emailBody += `   Email: ${formData.policy.email}\n`;
      emailBody += `   Address 1: ${formData.policy.addressOne}\n`;
      emailBody += `   Address 2: ${formData.policy.addressTwo}\n`;
      emailBody += `   City: ${formData.policy.city}\n`;
      emailBody += `   State/Province: ${formData.policy.state}\n`;
      emailBody += `   Country: ${formData.policy.country}\n`;
      emailBody += `   Zip/Postal Code: ${formData.policy.postalCode}\n`;
    }
    emailBody += `\n`;
    emailBody += `Loss Information:\n`;
    emailBody += `   Date: ${this.formatDate(formData.loss.date)}\n`;
    emailBody += `   Description: ${this.indentDescription(formData.loss.description)}\n`;
    emailBody += `   Address 1: ${formData.loss.addressOne}\n`;
    emailBody += `   Address 2: ${formData.loss.addressTwo}\n`;
    emailBody += `   City: ${formData.loss.city}\n`;
    emailBody += `   State/Province: ${formData.loss.state}\n`;
    emailBody += `   Country: ${formData.loss.country}\n`;
    emailBody += `   Zip/Postal Code: ${formData.loss.postalCode}\n`;
    emailBody += `\n`;
    emailBody += `Generated by MRSI Claims FNOL Portal.\n`;

    // Create the mailto link
    const subject = encodeURIComponent('FNOL Portal - New Submission');
    emailBody = encodeURIComponent(emailBody);

    return `mailto:${environment.claimsMailbox}?subject=${subject}&body=${emailBody}`;
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
