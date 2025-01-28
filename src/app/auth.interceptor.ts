import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  private isTokenExpired(token: string): boolean {
    try {
      const jwtPayload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      const exp = jwtPayload.exp; // Expiry timestamp in seconds
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return exp < currentTime; // Returns true if the token is expired
    } catch (e) {
      console.error('Error decoding token:', e);
      return true; // Treat the token as expired if decoding fails
    }
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip login requests
    if (request.url.includes('/login')) {
      return next.handle(request);
    }

    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    if (token) {
      if(this.isTokenExpired(token))
      {
        console.log("token expired");
        localStorage.removeItem("token");
        const userConfirmed = window.confirm('Your session has expired. Do you want to login again ?');

      if (userConfirmed) {
        this.router.navigateByUrl('/login');
          return next.handle(request);
      } 
      }

      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Request with Authorization header:', authRequest);
      return next.handle(authRequest);
    }

    console.log('No token found, sending request without Authorization header.');
    return next.handle(request);
  }
  
}
