import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

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
  ) { }

  copyTextToClipboard() {
    navigator.clipboard.writeText(this.data.emailBody).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000); // Reset icon after 2 second
    }, (err) => {
      console.error('Failed to copy text: ', err);
    });
  }
}