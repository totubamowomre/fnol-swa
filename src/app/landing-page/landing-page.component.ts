import { Component } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { TermsDialogComponent } from '../components/terms-dialog/terms-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  isStartButtonEnabled = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private sessionService: SessionService
  ) {}

  openTermsDialog(event: any): void {
    event.preventDefault();
    const dialogRef = this.dialog.open(TermsDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      this.isStartButtonEnabled = result;
    });
  }

  async onStartButtonClick(): Promise<any> {
    try {
      SessionService.clearAll();
      const sessionKey: string = await this.sessionService.startSession();
      this.router.navigate(['/form'], { state: { sessionKey: sessionKey } });
    } catch (error) {
      throw error;
    }
  }
}
