import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserI } from '../../model/user.interface';
import { environment } from '../../../environments/environment';
import { LoginResponseI } from '../../model/login-response.interface';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private storageService: StorageService
  ) {}

  findByUsername(username: string): Observable<UserI[]> {
    console.log(username);
    return this.http.get<UserI[]>(
      `${this.apiBaseUrl}/users/find-by-username?username=${username}`
    );
  }

  create(user: UserI): Observable<LoginResponseI> {
    return this.http
      .post<LoginResponseI>(`${this.apiBaseUrl}/auth/register`, user)
      .pipe(
        tap((res: LoginResponseI) => {
          this.storageService.saveUser(user, res.access_token);
          this.snackbar.open(
            `User ${user.username} created successfully`,
            'Close',
            {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
        }),
        catchError((e) => {
          this.snackbar.open(
            `User could not be created, due to: ${e.error.message}`,
            'Close',
            {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
          return throwError(() => e);
        })
      );
  }
}
