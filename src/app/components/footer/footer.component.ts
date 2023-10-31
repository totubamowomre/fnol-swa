import { Component } from '@angular/core';
import { ApiService } from 'src/api/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  name = '...';
  version = '...';

  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    this.apiService.getStatus().subscribe({
      next: (response) => {
        this.name = response.name
        this.version = response.version;
      },
      error: (error) => {
        console.error('Error: ' + JSON.stringify(error.error));
      },
      complete: () => {
        console.log('Connected to backend');
      }
    });
  }
}
