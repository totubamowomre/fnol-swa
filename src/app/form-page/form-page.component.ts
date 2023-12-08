import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialogComponent } from '../components/session-expired-dialog/session-expired-dialog.component';
import { SessionReminderDialogComponent } from '../components/session-reminder-dialog/session-reminder-dialog.component';
import { environment } from 'src/environments/environment';
import { EmailTooLargeDialogComponent } from '../components/email-too-large-dialog/email-too-large-dialog.component';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
})
export class FormPageComponent implements OnInit {
  private sessionKey!: string | null;
  data!: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private sessionService: SessionService,
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

  formatDateUS(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  indentText(text: string, indentLength: number): string {
    const indentSpace = ' '.repeat(indentLength);
    return text.split('\n').join(`\n${indentSpace}`);
  }

  async handleFormSubmit(data: any) {
    if (!this.sessionKey) {
      throw new Error('Invalid FNOL ID');
    }
    this.data = data;
    SessionService.setSessionData(data);
    let fnolId = this.sessionKey;

    const emailBody = this.generateEmailBody(data);

    const emailLink = await this.constructEmailLink(emailBody);

    // Open the default mail client
    window.open(emailLink, '_blank');
    this.router.navigate(['/confirmation'], { state: { fnolId: this.formatDateUS(new Date())+"_"+fnolId } })
  }

  generateEmailBody(formData: any): string {
    let emailBody = `Generated by MRSI Claims FNOL Portal - Reference: ${this.sessionKey}.\n`;

    emailBody += `Reported by:\n`;
    emailBody += `  Role in Relation to Loss: ${formData.reporter.relationToInsured}\n`;
    emailBody += `  Title: ${formData.reporter.title}\n`;
    emailBody += `  First Name: ${formData.reporter.firstName}\n`;
    emailBody += `  Last Name: ${formData.reporter.lastName}\n`;
    emailBody += `  Phone: ${formData.reporter.phone}\n`;
    emailBody += `  Email: ${formData.reporter.email}\n`;
    emailBody += `  Address 1: ${formData.reporter.addressOne}\n`;
    emailBody += `  Address 2: ${formData.reporter.addressTwo}\n`;
    emailBody += `  City: ${formData.reporter.city}\n`;
    emailBody += `  State: ${formData.reporter.state}\n`;
    emailBody += `  Country: ${formData.reporter.country}\n`;
    emailBody += `  Postal Code: ${formData.reporter.postalCode}\n`;
    emailBody += `\n`;
    emailBody += `Insured Policy Information:\n`;
    emailBody += `  Policy Number: ${formData.policy.policyNumber}\n`;
    if (formData.policy.contactSameAsReporter) {
      emailBody += `  Same Contact and Address as Reported by: Yes\n`;
    } else {
      emailBody += `  Title: ${formData.policy.title}\n`;
      emailBody += `  First Name: ${formData.policy.firstName}\n`;
      emailBody += `  Last Name: ${formData.policy.lastName}\n`;
      emailBody += `  Phone: ${formData.policy.phone}\n`;
      emailBody += `  Email: ${formData.policy.email}\n`;
      emailBody += `  Address 1: ${formData.policy.addressOne}\n`;
      emailBody += `  Address 2: ${formData.policy.addressTwo}\n`;
      emailBody += `  City: ${formData.policy.city}\n`;
      emailBody += `  State: ${formData.policy.state}\n`;
      emailBody += `  Country: ${formData.policy.country}\n`;
      emailBody += `  Postal Code: ${formData.policy.postalCode}\n`;
    }

    // Loss InformationS
    emailBody += `\n`;
    emailBody += `Loss Information:\n`;
    emailBody += `  Date: ${this.formatDateUS(formData.loss.date)}\n`;
    emailBody += `  Description: ${this.indentText(formData.loss.description, 21)}\n`;
    emailBody += `  Address 1: ${formData.loss.losses.addressOne}\n`;
    emailBody += `  Address 2: ${formData.loss.losses.addressTwo}\n`;
    emailBody += `  City: ${formData.loss.losses.city}\n`;
    emailBody += `  State: ${formData.loss.losses.state}\n`;
    emailBody += `  Country: ${formData.loss.losses.country}\n`;
    emailBody += `  Postal Code: ${formData.loss.losses.postalCode}\n`;
    emailBody += `  Were Authorities Notified?: ${formData.loss.areAuthoritiesNotified}\n`;
    if (formData.loss.areAuthoritiesNotified === 'Yes') {
      emailBody += `    Type: ${formData.loss.authorityType}\n`;
      emailBody += `    Report Number: ${formData.loss.authorityReportNumber}\n`;
      emailBody += `    Description: ${this.indentText(formData.loss.authorityAdditionalInformation, 22)}\n`;
    }
    emailBody += `  Any Witness of Loss: ${formData.loss.anyWitnessOfLoss}\n`;
    formData.loss.witnesses.forEach((witness: any, index: number) => {
      emailBody += `  Witness ${index + 1}:\n`;
      emailBody += `    Title: ${witness.title}\n`;
      emailBody += `    First Name: ${witness.firstName}\n`;
      emailBody += `    Last Name: ${witness.lastName}\n`;
      emailBody += `    Email: ${witness.email}\n`;
      emailBody += `    Phone: ${witness.phone}\n`;
      emailBody += `    Address 1: ${witness.addressOne}\n`;
      emailBody += `    Address 2: ${witness.addressTwo}\n`;
      emailBody += `    City: ${witness.city}\n`;
      emailBody += `    State: ${witness.state}\n`;
      emailBody += `    Country: ${witness.country}\n`;
      emailBody += `    Postal Code: ${witness.postalCode}\n`;
    });

    // Claimant Information
    emailBody += `\n`;
    emailBody += `Claimant Information:\n`;
    formData.claimant.claimants.forEach((claimant: any, index: number) => {
      emailBody += `  Claimant ${index + 1}:\n`;
      emailBody += `    Title: ${claimant.title}\n`;
      emailBody += `    First Name: ${claimant.firstName}\n`;
      emailBody += `    Last Name: ${claimant.lastName}\n`;
      emailBody += `    Email: ${claimant.email}\n`;
      emailBody += `    Phone: ${claimant.phone}\n`;
      emailBody += `    Address 1: ${claimant.addressOne}\n`;
      emailBody += `    Address 2: ${claimant.addressTwo}\n`;
      emailBody += `    City: ${claimant.city}\n`;
      emailBody += `    State: ${claimant.state}\n`;
      emailBody += `    Country: ${claimant.country}\n`;
      emailBody += `    Postal Code: ${claimant.postalCode}\n`;
    });

    return emailBody;
  }


  async constructEmailLink(emailBody: string): Promise<string> {
    // Create the mailto link
     const subject = encodeURIComponent("FNOL Portal Request - Reference: "+ this.sessionKey);
    const baseMailto = `mailto:${environment.claimsMailbox}?subject=${subject}&body=`;
    let encodedEmailBody = encodeURIComponent(emailBody);
    // Check the total length of the URL
    if ((baseMailto + encodedEmailBody).length > 2000) {
      //download Payload Text File
      downloadText(emailBody,"FNOL Portal Request - Reference: "+ this.sessionKey);
      const clippedEmailBody = emailBody.substring(emailBody.indexOf('\n') + 1);
      await new Promise<boolean>(resolve => {
        const dialogRef = this.dialog.open(EmailTooLargeDialogComponent, {
          data: { emailBody: clippedEmailBody }
        });
        dialogRef.afterClosed().subscribe(userChoice => {
          console.log('userChoice' + userChoice);
          resolve(userChoice);
        });
      });
      encodedEmailBody = encodeURIComponent(`${emailBody.split('\n')[0]}\n<<Paste clipboard here>>\n`);
    }
    return baseMailto + encodedEmailBody;
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
function downloadText( data: BlobPart,subject: string) {
  const blob = new Blob([data], { type: 'text/plain'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = subject;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);;
}

