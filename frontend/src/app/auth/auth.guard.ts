import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // quick check: if token present, allow; otherwise try refresh (server-side cookie)
    if (this.auth.getAccessToken()) return of(true);


    return this.auth.refreshAccessToken().pipe(
      map(_ => true),
      // if refresh fails, redirect
      // catchError(() => { this.router.navigate(['/login']); return of(false); })
    );
  }
}