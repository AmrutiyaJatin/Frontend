import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service'; // To get user ID
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  shippingInfo = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  };
  cartItems: any[] = [];
  totalPrice: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  isLoadingCart: boolean = true;
  isProcessingOrder: boolean = false;
  userId: number = 1; // Placeholder: Replace with actual logged-in user ID

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // In a real app, get the userId from AuthService (e.g., from decoded JWT token)
    // const userId = this.authService.getUserId();
    // if (userId) {
    //   this.userId = userId;
    //   this.loadCartForCheckout();
    // } else {
    //   this.errorMessage = 'User not logged in. Please log in to checkout.';
    //   this.isLoadingCart = false;
    //   this.router.navigate(['/login']);
    // }
    this.loadCartForCheckout(); // Using placeholder userId
  }

  loadCartForCheckout(): void {
    this.isLoadingCart = true;
    this.errorMessage = '';
    this.cartService.getCartItems(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        if (this.cartItems.length === 0) {
          this.errorMessage = 'Your cart is empty. Please add items before checking out.';
        }
        this.isLoadingCart = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load cart for checkout. Please try again.';
        this.isLoadingCart = false;
        console.error('Error loading cart for checkout:', err);
      }
    });
  }

  placeOrder(): void {
    if (this.cartItems.length === 0) {
      this.errorMessage = 'Your cart is empty. Cannot place an order.';
      return;
    }

    if (!this.shippingInfo.fullName || !this.shippingInfo.address || !this.shippingInfo.city || !this.shippingInfo.postalCode || !this.shippingInfo.country) {
      this.errorMessage = 'Please fill in all shipping information.';
      return;
    }

    this.isProcessingOrder = true;
    this.errorMessage = '';
    this.successMessage = '';

    const orderData = {
      userId: this.userId,
      shippingInfo: this.shippingInfo,
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price // Price at the time of order
      })),
      totalAmount: this.totalPrice
      // Backend will calculate estimated delivery date and send email
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.successMessage = 'Order placed successfully!';
        this.isProcessingOrder = false;
        // Assuming backend returns an orderId
        const orderId = response.orderId;

        // Clear the cart after successful order
        this.cartService.clearCart(this.userId).subscribe({
          next: () => console.log('Cart cleared successfully after order.'),
          error: (err) => console.error('Failed to clear cart:', err)
        });

        this.router.navigate(['/order-confirmation', orderId]);
      },
      error: (err) => {
        this.errorMessage = 'Failed to place order. Please try again.';
        this.isProcessingOrder = false;
        console.error('Error placing order:', err);
      }
    });
  }
}

