import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/api/api.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  private formValue!: any;
  private fnolId!: string;

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

  handleFormSubmit(newFormValue: any) {
    if (!this.fnolId) {
      console.error("Fnol ID is not available.");
      return;
    }

    newFormValue.meta = this.formValue.meta;

    this.apiService.updateFnol(this.fnolId, newFormValue).subscribe({
      next: () => {
        this.router.navigate(['/confirmation']);
      },
      error: (error: any) => {
        console.error("Error updating Fnol:", error);
      }
    });
  }

  ngOnInit(): void {
    this.formValue = { meta: { sessionKey: history.state.sessionKey } };

    this.apiService.createFnol(this.formValue).subscribe({
      next: (response: HttpResponse<any>) => {
        const locationHeader = response.headers.get('Location');
        if (locationHeader) {
          this.fnolId = locationHeader.split('/').pop() || '';
          console.log("Created new FNOL", this.fnolId);
        }
      },
      error: (error: any) => {
        console.error("Error creating Fnol:", error);
      }
    });
  }
}
