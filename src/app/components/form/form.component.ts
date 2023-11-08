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
  isLoading = false;

  @Output() emmitter: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      reporter: this.formBuilder.group({
        relationToInsured: ['', Validators.required],
        title: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [''],
        phone: [''],
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        country: ['United States'],
        postalCode: ['']
      }),
      policy: this.formBuilder.group({
      }),
      loss: this.formBuilder.group({
      }),
      claimant: this.formBuilder.group({
      }),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.emmitter.emit(this.form.value);
      console.log('Submitted with value: ' + JSON.stringify(this.form.value));
    }
  }

}
