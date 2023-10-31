import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  name = '...';

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    fetch('/api/status')
      .then((response: any) => response.json())
      .then((status: any) => {
        this.name = status.name;
      });
  }
}
