import { Component } from '@angular/core';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  constructor() { }

  ngOnInit() { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      console.log(file);
      // Handle the file here. You can make a service call or read the file as needed.
    }
  }
}
