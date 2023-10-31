import { Component } from '@angular/core';
import { ApiService } from 'src/api/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(private apiService: ApiService) { }

  ngOnInit() { }

  onSubmit(event: any) {
    const data = {
      reporter: {
        firstName: "string",
        lasName: "string"
      },
      policy: {
        policyNumber: "string"
      },
      loss: {
        lossDate: "string"
      },
      blobLink: "string"
    }

    this.apiService.postData(data).subscribe(
      (response) => {
        alert('Data sent! Response: ' + JSON.stringify(response));
      },
      (error) => {
        alert('Error: ' + JSON.stringify(error.error));
      }
    );


    console.error(event);
  }
}
