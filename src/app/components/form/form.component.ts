import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @Input() initialData: any;
  form: FormGroup;
  currentDate = new Date();
  isLoading = true;
  @Output() emmitter: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      reporter: this.formBuilder.group({
        relationToInsured: [''],
        title: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.pattern(/^[0-9]/)],
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        country: ['United States'],
        customCountry: [''],
        postalCode: ['']
      }),
      policy: this.formBuilder.group({
        policyNumber: ['', Validators.required],
        contactSameAsReporter: [false],
        title: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.pattern(/^[0-9]$/)],
        addressOne: [''],
        addressTwo: [''],
        city: [''],
        state: [''],
        country: ['United States'],
        customCountry: [''],
        postalCode: ['']
      }),
      loss: this.formBuilder.group({
        date: ['', Validators.required],
        description: ['', Validators.required],
        lossData: [''],
        losses:this.formBuilder.group({
          addressOne: [''],
          addressTwo: [''],
          city: [''],
          state: [''],
          country: ['United States'],
          customCountry: [''],
          postalCode: ['']
        }),
        anyWitnessOfLoss: ['Yes', Validators.required],
        witnesses: this.formBuilder.array([
          this.formBuilder.group({
            title: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.pattern(/^[0-9]$/)],
            addressOne: [''],
            addressTwo: [''],
            city: [''],
            state: [''],
            country: ['United States'],
            customCountry: [''],
            postalCode: ['']
          })
        ]),
        areAuthoritiesNotified: ['No', Validators.required],
        authorityType: [{ value: '', disabled: true }],
        authorityReportNumber: [{ value: '', disabled: true }],
        authorityAdditionalInformation: [{ value: '', disabled: true }]
      }),
      claimant: this.formBuilder.group({
        claimantContact: [''],
        claimants: this.formBuilder.array([
          this.formBuilder.group({
            title: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.pattern(/^[0-9]/)],
            addressOne: [''],
            addressTwo: [''],
            city: [''],
            state: [''],
            country: ['United States'],
            customCountry: [''],
            postalCode: ['']
          })
        ]),
      })
    });

    this.form?.get('policy.contactSameAsReporter')?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.form.get('policy.title')?.disable();
        this.form.get('policy.firstName')?.disable();
        this.form.get('policy.lastName')?.disable();
        this.form.get('policy.email')?.disable();
        this.form.get('policy.phone')?.disable();
        this.form.get('policy.addressOne')?.disable();
        this.form.get('policy.addressTwo')?.disable();
        this.form.get('policy.city')?.disable();
        this.form.get('policy.state')?.disable();
        this.form.get('policy.country')?.disable();
        this.form.get('policy.postalCode')?.disable();
      } else {
        this.form.get('policy.title')?.enable();
        this.form.get('policy.firstName')?.enable();
        this.form.get('policy.lastName')?.enable();
        this.form.get('policy.email')?.enable();
        this.form.get('policy.phone')?.enable();
        this.form.get('policy.addressOne')?.enable();
        this.form.get('policy.addressTwo')?.enable();
        this.form.get('policy.city')?.enable();
        this.form.get('policy.state')?.enable();
        this.form.get('policy.country')?.enable();
        this.form.get('policy.postalCode')?.enable();
      }
    });
    
    this.form?.get('loss.areAuthoritiesNotified')?.valueChanges.subscribe((value) => {
      if (value === 'Yes') {
        this.form.get('loss.authorityType')?.enable();
        this.form.get('loss.authorityReportNumber')?.enable();
        this.form.get('loss.authorityAdditionalInformation')?.enable();
      } else {
        this.form.get('loss.authorityType')?.disable();
        this.form.get('loss.authorityReportNumber')?.disable();
        this.form.get('loss.authorityAdditionalInformation')?.disable();
      }
    });

    this.form?.get('loss.anyWitnessOfLoss')?.valueChanges.subscribe((value) => {
      if (value === 'Yes') {
        this.addWitness();
      } else {
        while (this.witnesses.length !== 0) {
          this.witnesses.removeAt(0);
        }
      }
    });

    this.form?.get('loss.lossData')?.valueChanges.subscribe((value) => {
      if (value === 'SameAsReporter') {
        this.losses.setValue(this.mapLossFields(this.form.value.reporter));
      } else if (value === 'SameAsInsured') {
        if(this.form?.get('policy.contactSameAsReporter')?.value === true){
          this.losses.setValue(this.mapLossFields(this.form.value.reporter));
        } else {
          this.losses.setValue(this.mapLossFields(this.form.value.policy));
        }
      } else {
        this.losses.reset();
      }
    });

    this.form?.get('claimant.claimantContact')?.valueChanges.subscribe((value) => {
      if (value === 'SameAsReporter') {
        this.claimants.at(0).setValue(this.mapClaimantFields(this.form.value.reporter));
      } else if (value === 'SameAsInsured') {
        if(this.form?.get('policy.contactSameAsReporter')?.value === true){
          this.claimants.at(0).setValue(this.mapClaimantFields(this.form.value.reporter));
        } else {
          this.claimants.at(0).setValue(this.mapClaimantFields(this.form.value.policy));
        }
      } else {
        this.claimants.at(0).reset();
      }
    });
  }

  // Helper method to map only the relevant fields
  mapClaimantFields(source: any): any {
    return {
      title: source.title,
      firstName: source.firstName,
      lastName: source.lastName,
      email: source.email,
      phone: source.phone,
      addressOne: source.addressOne,
      addressTwo: source.addressTwo,
      city: source.city,
      state: source.state,
      country: source.country,
      customCountry: source.customCountry,
      postalCode: source.postalCode
    };
  }

  mapLossFields(source: any): any {
    return {
      addressOne: source.addressOne,
      addressTwo: source.addressTwo,
      city: source.city,
      state: source.state,
      country: source.country,
      customCountry: source.customCountry,
      postalCode: source.postalCode
    };
  }

  get witnesses(): FormArray {
    return this.form.get('loss.witnesses') as FormArray;
  }

  get losses(): FormGroup {
    return this.form.get('loss.losses') as FormGroup;
  }

  get claimants(): FormArray {
    return this.form.get('claimant.claimants') as FormArray;
  }

  addWitness(): void {
    this.witnesses.push(this.formBuilder.group({
      title: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
      addressOne: [''],
      addressTwo: [''],
      city: [''],
      state: [''],
      country: ['United States'],
      postalCode: ['']
    }));
  }

  addClaimant(): void {
    this.claimants.push(this.formBuilder.group({
      title: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
      addressOne: [''],
      addressTwo: [''],
      city: [''],
      state: [''],
      country: ['United States'],
      postalCode: ['']
    }));
  }

  async resetForm() {
    this.form.reset();
    this.form.get('claimant.claimantContact')?.setValue("");
    this.form.get('loss.lossData')?.setValue("");
    this.form.get('loss.areAuthoritiesNotified')?.setValue("No");
    this.form.get('loss.anyWitnessOfLoss')?.setValue("Yes");
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.emmitter.emit(this.form.value);
    }
  }
}
