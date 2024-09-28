import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

    const rol = localStorage.getItem('rol');
  
    if (rol) {
      const targetUrl = state.url;
  
      if (rol === 'user' && targetUrl !== '/chat-main-componente') {
        return this.router.parseUrl('/chat-main-componente');
      }
  
      if (rol === 'admin' && targetUrl !== '/fileupload') {
        return this.router.parseUrl('/fileupload');
      }
      return true;
    } else {
      return this.router.parseUrl('/login');
    }
  }
  
  
}
