import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.scss']
})
export class ConfirmationPageComponent implements OnInit {
  fnolId!: string | null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.fnolId = history.state.fnolId;
    if (!this.fnolId) {
      this.router.navigate(['']);
    }
  }
}