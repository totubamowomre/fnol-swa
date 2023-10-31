import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/api/api.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() { }

  onSubmit(event: any) {
    console.log(event);
    event.preventDefault();
    const data = {
      reporter: {
        firstName: "string",
        lastName: "string"
      },
      policy: {
        policyNumber: "string"
      },
      loss: {
        lossDate: "string"
      },
      blobLink: "string"
    }

    this.apiService.postData(data).subscribe({
      next: (response) => {
        this.router.navigate(['/confirmation']);
        console.log(response);
      },
      error: (error) => {
        console.error('Error: ' + JSON.stringify(error.error));
      },
      complete: () => {
        console.log('complete');
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      console.log(file);
      // Handle the file here. You can make a service call or read the file as needed.
    }
  }
}
