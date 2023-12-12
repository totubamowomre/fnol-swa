import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-email-too-large-dialog',
  templateUrl: './email-too-large-dialog.component.html',
  styleUrls: ['./email-too-large-dialog.component.scss']
})
export class EmailTooLargeDialogComponent {
  copied = false;

  constructor(
    public dialogRef: MatDialogRef<EmailTooLargeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { emailBody: string }
  ) { 
    dialogRef.disableClose = true;
  }
  
   downloadText() {
    const blob = new Blob([this.data.emailBody], { type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "FNOL Portal Request - Reference: "+SessionService.getSessionKey();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);;
  }


  copyTextToClipboard() {
    navigator.clipboard.writeText(this.data.emailBody).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000); // Reset icon after 2 second
    }, (err) => {
      console.error('Failed to copy text: ', err);
    });
  }
}