import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CustomValidators } from '../../common/custom-validators';
import { UserService } from '../../services/user-service/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup = new FormGroup(
    {
      email: new FormControl(null, [Validators.required, Validators.email]),
      // username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      passwordConfirm: new FormControl(null, [Validators.required]),
    },
    { validators: CustomValidators.passwordsMatching }
  );

  constructor(private userService: UserService, private router: Router) {}

  register() {
    if (this.form.valid) {
      this.userService
        .create({
          username: this.email.value,
          password: this.password.value,
        })
        .pipe(
          tap(() => {
            this.router.navigate(['../login']);
          })
        )
        .subscribe();
    }
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  // get username(): FormControl {
  //   return this.form.get('username') as FormControl;
  // }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get passwordConfirm(): FormControl {
    return this.form.get('passwordConfirm') as FormControl;
  }
}
