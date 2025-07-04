import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service'; // To get user ID
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  userId: number = 1; // Placeholder: Replace with actual logged-in user ID

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // In a real app, get the userId from AuthService (e.g., from decoded JWT token)
    // const userId = this.authService.getUserId();
    // if (userId) {
    //   this.userId = userId;
    //   this.loadOrderHistory();
    // } else {
    //   this.errorMessage = 'User not logged in. Please log in to view your order history.';
    //   this.isLoading = false;
    // }
    this.loadOrderHistory(); // Using placeholder userId
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.orderService.getUserOrders(this.userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load order history. Please try again.';
        this.isLoading = false;
        console.error('Error fetching order history:', err);
      }
    });
  }
}

