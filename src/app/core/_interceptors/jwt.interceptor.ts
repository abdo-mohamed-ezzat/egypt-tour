import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../_services/authentication.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.authenticationService.userValue;
        const isLoggedIn = user?.token;
        const isApiUrl = request.url.startsWith(environment.APIURL);
        if (isLoggedIn && isApiUrl) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
        }
      
        return next.handle(request).pipe(
          catchError(err => {
            if (err.status === 401) {
              // auto logout if 401 response returned from api
              this.authenticationService.logout();
            }
      
            const error = err.error.message || err.statusText;
            return throwError(error);
          })
        );
      }
}