import { Injectable } from '@angular/core';
import { UserI } from '../../model/user.interface';

export const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: UserI, token: string): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify({ user, token }));
  }

  public getUser(): UserI {
    const data = window.sessionStorage.getItem(USER_KEY);
    if (data) {
      return JSON.parse(data).user;
    }

    return {};
  }

  public getToken(): string | null {
    const data = window.sessionStorage.getItem(USER_KEY);
    if (data) {
      return JSON.parse(data).token;
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
