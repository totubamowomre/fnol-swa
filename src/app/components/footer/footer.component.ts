import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
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
