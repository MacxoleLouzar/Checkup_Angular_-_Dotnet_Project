import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirstkeyPipe } from '../../shared/pipes/firstkey.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private snackBar = inject(MatSnackBar);
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
      const formData = {
        firstname: this.form.value.firstName,
        lastname: this.form.value.lastName,
        email: this.form.value.email,
        password: this.form.value.password
      };
      console.log('Sending data:', formData);
      this.service.CreateUser(formData)
      .subscribe({
        next:(res:any) => {
          console.log('Success response:', res);
          this.form.reset()
          this.isSubmitting = false
          this.snackBar.open('User created successfully!', 'Close', { duration: 3000 });
        },
        error:(err: any) => {
          console.log('Error response:', err);
          console.log('Error details:', err.error);
          console.log('Validation errors:', err.error.errors);
          this.isSubmitting = false;
          
          let errorMessage = 'Registration failed. ';
          if (err.error.errors && err.error.errors.length > 0) {
            errorMessage += err.error.errors.join(', ');
          }
          
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      })
    }
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName)
    return Boolean(control?.invalid) && (this.isSubmitting || Boolean(control?.touched))
  }
}
