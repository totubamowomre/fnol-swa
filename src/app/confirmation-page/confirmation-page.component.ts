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
  data!: any;
  emailLink!: any;
  hideButton: boolean = false;

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fnolId = history.state.fnolId;
    this.data = history.state.emailBody;
    this.emailLink = history.state.emailLink;
    this.formatDateUS(new Date());
    if (!this.fnolId) {
      this.router.navigate(['']);
    }
    if(this.data.length <= 2000) {
      this.hideButton = true;
    }
  }

  formatDateUS(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    this.RefDate = month+"-"+day+"-"+year+"_";
  }
  
  regenerateEmail() {
    window.open(this.emailLink, '_blank');
  }

  downloadText() {
    const blob = new Blob([this.data], { type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "FNOL Portal Request - Reference: "+SessionService.getSessionKey();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);;
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
