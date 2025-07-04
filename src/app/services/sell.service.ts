import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../app.constants'; // Updated import

@Injectable({
  providedIn: 'root'
})
export class SellService {
  private apiUrl = `${API_GATEWAY_URL}/api/sell`; // <-- add /api here

  constructor(private http: HttpClient) { }

  submitSellRequest(sellData: any): Observable<any> {
    // sellData should include title, description, expectedPrice, and imageUrl.
    // In a real app, the image would be uploaded to a storage service first,
    // and the URL would be passed here.
    return this.http.post(`${this.apiUrl}`, sellData);
  }

  getUserSellRequests(userId: number): Observable<any[]> {
    // Assuming backend endpoint is /sell/{userId}/requests
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/requests`);
  }

  // Admin-related methods (if needed on frontend for admin view)
  getPendingSellRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  updateSellRequestStatus(requestId: number, status: string): Observable<any> {
    const payload = { status }; // lowercase!
    return this.http.put(`${this.apiUrl}/update-status/${requestId}`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

