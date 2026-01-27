import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirstkeyPipe } from '../../shared/pipes/firstkey.pipe';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FirstkeyPipe],
  templateUrl: './registration.component.html',
  styles: ''
})
export class RegistrationComponent {
  form: FormGroup;
  isSubmitting: boolean = false
  passwordMatchValidators: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value)
      confirmPassword.setErrors({ passwordMismatch: true })
    else
      confirmPassword?.setErrors(null)

    return null;
  }

  constructor(public formBuilder: FormBuilder, private service: AuthService) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
      confirmPassword: [''],
    }, { validators: this.passwordMatchValidators });
  }
  onSubmit() {
    this.isSubmitting = true
    if(this.form.valid){
      this.service.CreateUser(this.form.value)
      .subscribe({
        next:(res:any) => {
          if(res.success){
            this.form.reset()
            this.isSubmitting = false
          }
          console.log(res)
        },
        error:(err: any) => {
          console.log(err)
        }
      })
    }
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName)
    return Boolean(control?.invalid) && (this.isSubmitting || Boolean(control?.touched))
  }
}
