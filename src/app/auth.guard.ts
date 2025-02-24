import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MasterserviceService } from './masterservice.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public service : MasterserviceService,
    public router : Router
  )
  {

  }
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
  token = localStorage.getItem('token')

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      if(this.token)
        if(this.isTokenExpired(this.token))
        {
          
          this.router.navigate(['/login']);
          return false 

        }
        else {
          return true
        }

      
      else {
        this.router.navigate(['/login']);
        return false 
      }
    }
  
}
