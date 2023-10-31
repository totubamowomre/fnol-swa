import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  private sessionKey: any;
  private fnolDatakey = environment.fnolDatakey;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sessionService.currentSessionState.subscribe(isActive => {
      if (!isActive) {
        this.clearFnolData();
        // Clear the form & redirect to home page
        this.router.navigate(['']);
      }
    });
  }

  onCompleted() {
    this.router.navigate(['/confirmation']);
  }

  ngOnInit(): void {
    this.sessionKey = history.state.sessionKey;
  }

  // Save FNOL data to session storage
  private saveFnolData(data: any): void {
    sessionStorage.setItem(this.fnolDatakey, JSON.stringify(data));
  }

  // Get FNOL data from session storage
  private getFnolData(): any {
    const storedData = sessionStorage.getItem(this.fnolDatakey);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  }

  // Clear FNOL data from session storage
  private clearFnolData(): void {
    sessionStorage.removeItem(this.fnolDatakey);
  }
}