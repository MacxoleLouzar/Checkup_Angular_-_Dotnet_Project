import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirstkeyPipe } from '../../shared/pipes/firstkey.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

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
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const { firstName: firstname, lastName: lastname, email, password } = this.form.value;

    this.service.CreateUser({ firstname, lastname, email, password })
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.form.reset();
          this.toastr.success('User created successfully!', 'Success');
        },
        error: (err) => {
          const msgs = err.error.errors.join(', ') || 'Registration failed.';
          this.toastr.error(msgs, 'Error');
        }
      });
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName)
    return Boolean(control?.invalid) && 
    (Boolean(control?.dirty) ||(this.isSubmitting || Boolean(control?.touched)))
  }
}
