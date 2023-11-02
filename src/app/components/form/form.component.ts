import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() initialData: any;
  form!: FormGroup;

  @Output() emmitter: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      reporter: this.formBuilder.group({
        relationToInsured: ['', Validators.required],
        title: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.emmitter.emit(this.form.value);
      console.log('Submitted with value: ' + JSON.stringify(this.form.value));
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log(file);
      // Handle the file here.
    }
  }
}
