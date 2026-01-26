import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styles: ''
})
export class RegistrationComponent {
  form: FormGroup;
  isSubmitting:boolean = false
passwordMatchValidators(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  constructor(public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
      confirmPassword: [''],
    },{validators:this.passwordMatchValidators});
  }
  onSubmit() {
    this.isSubmitting = true
    console.log(this.form.value)
  }

  hasDisplayableError(controlName: string):Boolean {
    const control = this.form.get(controlName)
    return Boolean(control?.invalid) && (this.isSubmitting || Boolean(control?.touched))
  }
}
