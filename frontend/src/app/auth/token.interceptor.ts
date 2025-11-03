// auth/token.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, from } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  let cloned = req;
  if (token) {
    cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        return from(auth.refreshAccessToken().toPromise()).pipe(
          switchMap((newToken) => {
            const retry = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
            return next(retry);
          }),
          catchError((e) => {
            auth.logout().subscribe();
            return throwError(() => e);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
