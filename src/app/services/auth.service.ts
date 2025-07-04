// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { API_GATEWAY_URL } from '../app.constants'; // Updated import

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = `${API_GATEWAY_URL}/auth`; // Updated reference
//   private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());

//   // Observable to let components react to login/logout status changes
//   isLoggedIn$ = this._isLoggedIn.asObservable();

//   constructor(private http: HttpClient) { }

//   private hasToken(): boolean {
//     return !!localStorage.getItem('authToken');
//   }

//   login(credentials: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
//       tap((response: any) => {
//         // Assuming your backend returns a token upon successful login
//         if (response && response.token) {
//           this.setToken(response.token);
//           this._isLoggedIn.next(true); // Update login status
//         }
//       })
//     );
//   }

//   register(userData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, userData).pipe(
//       tap((response: any) => {
//         // Optionally log in the user immediately after registration
//         if (response && response.token) {
//           this.setToken(response.token);
//           this._isLoggedIn.next(true); // Update login status
//         }
//       })
//     );
//   }

//   setToken(token: string): void {
//     localStorage.setItem('authToken', token);
//   }

//   getToken(): string | null {
//     return localStorage.getItem('authToken');
//   }

//   removeToken(): void {
//     localStorage.removeItem('authToken');
//     this._isLoggedIn.next(false); // Update login status
//   }

//   isLoggedIn(): boolean {
//     return this.hasToken();
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_GATEWAY_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_GATEWAY_URL}/auth`;
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('authToken');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          this._isLoggedIn.next(true);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setToken(response.token);
          this._isLoggedIn.next(true);
        }
      })
    );
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      this._isLoggedIn.next(false);
    }
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
