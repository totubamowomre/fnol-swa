import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements OnInit {
  fnolId!: string | null;
  RefDate!: string | null;

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fnolId = history.state.fnolId;
    this.formatDateUS(new Date());
    if (!this.fnolId) {
      this.router.navigate(['']);
    }
  }

  formatDateUS(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    this.RefDate = month+"-"+day+"-"+year+"_";
  }

  async onCreateAdditionalFnolButtonClick(): Promise<any> {
    try {
      SessionService.clearAll();
      const newSessionKey: string = await this.sessionService.startSession();
      this.router.navigate(['/form'], { state: { sessionKey: newSessionKey } });
    } catch (error) {
      throw error;
    }
  }
}
