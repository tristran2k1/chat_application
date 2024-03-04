import { Component, inject} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule, 
    MatCardModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  
  constructor(private authService: AuthService, private router: Router) { }
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  login() {
    if (this.form.valid) {
      this.authService.login({
        username: this.email.value,
        password: this.password.value
      }).pipe(
        tap(() => {this.router.navigate(['../dashboard'])})
      ).subscribe()
    }
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

}
