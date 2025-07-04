// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from './services/auth.service'; // Import your AuthService

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(private authService: AuthService) {} // Inject AuthService

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     const authToken = this.authService.getToken(); // Get token from AuthService

//     // If a token exists, clone the request and add the authorization header
//     if (authToken) {
//       const cloned = request.clone({
//         headers: request.headers.set('Authorization', `Bearer ${authToken}`)
//       });
//       return next.handle(cloned);
//     }
//     // Otherwise, proceed with the original request
//     return next.handle(request);
//   }
// }

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};
