import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  constructor(private router: Router) { }

  ngOnInit() { }

  onSubmit(event: any) {
    event.preventDefault();
    console.log(event);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log(file);
      // Handle the file here.
    }
  }
}
