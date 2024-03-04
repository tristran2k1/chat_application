import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StorageService, USER_KEY } from '../services/storage/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);
 
  const isLoggedIn = storageService.isLoggedIn();
  if(!isLoggedIn) {
    router.navigate(['login']);
  }
  return isLoggedIn;
};
