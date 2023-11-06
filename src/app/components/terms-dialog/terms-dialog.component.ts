import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss']
})
export class TermsDialogComponent {

  constructor(public dialogRef: MatDialogRef<TermsDialogComponent>) { }

  onAccept(): void {
    this.dialogRef.close(true);
  }

  onReject(): void {
    this.dialogRef.close(false);
  }

  printTerms(termsContent: HTMLElement): void {
    let printContents, popupWin;
    printContents = termsContent.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Claims FNOL - Print</title>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin!.document.close();
  }
}
