import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { API_GATEWAY_URL } from '../app.constants'; // Updated import
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${API_GATEWAY_URL}/cart`; // Updated reference
  private _cartItems = new BehaviorSubject<any[]>([]); // To hold current cart items
  cartItems$ = this._cartItems.asObservable();

  constructor(private http: HttpClient) { }

  // Fetch cart items for the current user
  getCartItems(userId: number): Observable<any[]> {
    // Assuming backend endpoint is /cart/{userId}/items
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/items`).pipe(
      tap(items => this._cartItems.next(items))
    );
  }

  addToCart(userId: number, productId: number, quantity: number = 1): Observable<any> {
    // Assuming backend endpoint is /cart/add
    return this.http.post(`${this.apiUrl}/add`, { userId, productId, quantity }).pipe(
      tap(() => this.getCartItems(userId).subscribe()) // Refresh cart after adding
    );
  }

  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<any> {
    // Assuming backend endpoint is /cart/update/{cartItemId}
    return this.http.put(`${this.apiUrl}/update/${cartItemId}`, { quantity }).pipe(
      tap(() => {
        // Find the user ID if necessary to refresh the cart, or just update local state
        // For simplicity, we'll assume the cart update is successful and local state can be updated
        const currentItems = this._cartItems.getValue();
        const updatedItems = currentItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        );
        this._cartItems.next(updatedItems);
      })
    );
  }

  removeCartItem(cartItemId: number): Observable<any> {
    // Assuming backend endpoint is /cart/remove/{cartItemId}
    return this.http.delete(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      tap(() => {
        const currentItems = this._cartItems.getValue();
        const filteredItems = currentItems.filter(item => item.cartItemId !== cartItemId);
        this._cartItems.next(filteredItems);
      })
    );
  }

  clearCart(userId: number): Observable<any> {
    // Assuming backend endpoint is /cart/clear/{userId} after checkout
    return this.http.delete(`${this.apiUrl}/clear/${userId}`).pipe(
      tap(() => this._cartItems.next([]))
    );
  }
}

