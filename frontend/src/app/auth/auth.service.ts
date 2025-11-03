import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


interface LoginResp { accessToken: string; user: any }


@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null; // keep access token in memory
  private user$ = new BehaviorSubject<any>(null);
  private refreshing = false;


  constructor(private http: HttpClient) { }


  signup(payload: { name: string; email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/signup`, payload);
  }


  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<LoginResp>(`${environment.apiUrl}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        tap(resp => {
          this.setAccessToken(resp.accessToken);
          this.user$.next(resp.user);
        })
      );
  }


  logout() {
    // call server to clear refresh cookie and/or revoke refresh token
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.clearAuth()));
  }


  private setAccessToken(token: string) {
    this.accessToken = token;
  }
  getAccessToken() { return this.accessToken; }


  private clearAuth() {
    this.accessToken = null;
    this.user$.next(null);
  }


  refreshAccessToken(): Observable<string> {
    if (this.refreshing) return throwError(() => new Error('refresh in progress'));
    this.refreshing = true;
    return this.http.post<LoginResp>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(resp => {
          this.setAccessToken(resp.accessToken);
          this.user$.next(resp.user);
          this.refreshing = false;
        }),
        map(resp => resp.accessToken),
        catchError(err => {
          this.refreshing = false;
          this.clearAuth();
          return throwError(() => err);
        })
      );
  }

  getUserObservable() { return this.user$.asObservable(); }
}