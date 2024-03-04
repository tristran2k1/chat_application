import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "../services/storage/storage.service";
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    // debugger;
    const storageService = inject(StorageService);    
    const token = storageService.getToken();
    console.log('Token:', token);
    const cloneRequest =  req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloneRequest);
  };
  