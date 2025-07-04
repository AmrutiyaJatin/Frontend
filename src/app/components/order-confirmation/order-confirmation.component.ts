import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  orderId: number | null = null;
  order: any = null;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('orderId');
      if (id) {
        this.orderId = +id;
        this.fetchOrderDetails(this.orderId);
      } else {
        this.errorMessage = 'Order ID not found.';
        this.isLoading = false;
      }
    });
  }

  fetchOrderDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load order details. Please try again.';
        this.isLoading = false;
        console.error('Error fetching order details:', err);
      }
    });
  }
}

