import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../app.constants'; // Updated import

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${API_GATEWAY_URL}/auth`; // User profile might be under auth service or a dedicated user service (Updated reference)

  constructor(private http: HttpClient) { }

  getUserProfile(userId: number): Observable<any> {
    // Assuming backend endpoint is /auth/profile/{userId}
    return this.http.get<any>(`${this.apiUrl}/profile/${userId}`);
  }

  updateUserProfile(userId: number, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/update/${userId}`, profileData);
  }
}

