import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CoreService } from './core.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private coreService: CoreService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let apiReq;
    const started = Date.now();
    const token = localStorage.getItem('app_token');

    /** Verify token available on localStorage then add it to headers. */
    if (token) {
      apiReq = req.clone({
        url: `${environment.baseUrl}${req.url}`,
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      apiReq = req.clone({
        url: `${environment.baseUrl}${req.url}`
      });
    }

    return next.handle(apiReq).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const elapsed = Date.now() - started;
            // console.log(
            //   `Request for ${apiReq.urlWithParams} took ${elapsed} ms.`
            // );
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            const elapsed = Date.now() - started;
            // console.log(
            //   `Request for ${apiReq.urlWithParams} failed after ${elapsed} ms.`
            // );
          }

          if (err.status === 401) {
            localStorage.removeItem('app_token');
            localStorage.removeItem('app_user');
            this.coreService.navigateTo('/login');
            return throwError(err);
          } else {
            return throwError(err);
          }
        }
      )
    );
    // return next.handle(apiReq);
  }
}
