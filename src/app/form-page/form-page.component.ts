import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/api/api.service';

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
    private router: Router
  ) {
    this.sessionService.currentSessionState.subscribe(isActive => {
      if (!isActive) {
        this.router.navigate(['']);
      }
    });
  }

  handleFormSubmit(data: any) {
    if (!this.fnolId) {
      throw new Error('Invalid fnolId');
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
