import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, tap } from 'rxjs';
import { LoginResponseI } from '../../model/login-response.interface';
import { UserI } from '../../model/user.interface';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBaseUrl = environment.apiBaseUrl;
  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private storageService: StorageService
  ) {}

  login(user: UserI): Observable<LoginResponseI> {
    return this.http
      .post<LoginResponseI>(`${this.apiBaseUrl}/auth/login`, user)
      .pipe(
        tap((res: LoginResponseI) =>
          this.storageService.saveUser(user, res.access_token)
        ),
        tap(() =>
          this.snackbar.open('Login Successfull', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          })
        )
      );

  }

  getLoggedInUser() {
    console.log('getLoggedInUser', this.storageService.getUser());
    return this.storageService.getUser();
  }
}
