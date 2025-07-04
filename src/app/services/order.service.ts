import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../app.constants'; // Updated import

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${API_GATEWAY_URL}/orders`; // Updated reference

  constructor(private http: HttpClient) { }

  createOrder(orderData: any): Observable<any> {
    // This typically includes userId, cart items, shipping info, etc.
    return this.http.post(`${this.apiUrl}/create`, orderData);
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`);
  }

  getUserOrders(userId: number): Observable<any[]> {
    // Assuming backend endpoint is /orders/{userId}/history
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/history`);
  }
}

