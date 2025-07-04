import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../app.constants'; // Updated import

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${API_GATEWAY_URL}/notification`; // Updated reference

  constructor(private http: HttpClient) { }

  // This method might be used to fetch a user's notifications or check if a notification was sent
  // Note: The backend's /notification/{everything} route is POST. This implies sending.
  // For frontend, you'd likely fetch *sent* notifications or status updates.
  // Assuming a GET endpoint for fetching notifications for a user:
  getUserNotifications(userId: number): Observable<any[]> {
    // This endpoint might not exist in your current backend setup, adjust as needed.
    // It would typically fetch a log of notifications or status updates.
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  // If you want to trigger a notification from frontend (e.g., "resend confirmation email")
  // This would correspond to your backend's POST /notification/{everything}
  triggerNotification(notificationData: any): Observable<any> {
    // Example: { recipient: 'user@example.com', subject: 'Order Confirmation', body: '...' }
    return this.http.post(`${this.apiUrl}/send`, notificationData);
  }

  triggerNotificationRaw(notification: any) {
    return this.http.post(
      'http://localhost:7000/notification/send',
      JSON.stringify(notification),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

