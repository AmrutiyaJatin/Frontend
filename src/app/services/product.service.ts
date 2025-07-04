import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../app.constants'; // Updated import

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${API_GATEWAY_URL}/products`; // Updated reference

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Add methods for creating, updating, deleting products (if needed for admin panel)
  // Example:
  // createProduct(productData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/add`, productData);
  // }
}

