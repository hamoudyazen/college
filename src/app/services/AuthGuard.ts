import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = localStorage.getItem('role');

    if (!role) {
      // User not logged in, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    // Check if the user's role is authorized for the requested route
    const authorizedRoles = route.data['role'];
    if (authorizedRoles && authorizedRoles.indexOf(role) === -1) {
      // Role not authorized, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    // Role authorized, allow access
    return true;
  }
}
