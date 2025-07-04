import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service'; // To get user ID
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = true;
  userId: number = 1; // Placeholder: Replace with actual logged-in user ID

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // In a real app, get the userId from AuthService (e.g., from decoded JWT token)
    // For now, using a placeholder.
    // const userId = this.authService.getUserId(); // Assume AuthService has this method
    // if (userId) {
    //   this.userId = userId;
    //   this.loadCartItems();
    // } else {
    //   this.errorMessage = 'User not logged in. Please log in to view your cart.';
    //   this.isLoading = false;
    //   this.router.navigate(['/login']);
    // }
    this.loadCartItems(); // Using placeholder userId
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cartService.getCartItems(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load cart items. Please try again.';
        this.isLoading = false;
        console.error('Error loading cart items:', err);
      }
    });
  }

  updateQuantity(item: any, newQuantity: number): void {
    if (newQuantity < 1) {
      newQuantity = 1; // Prevent quantity from going below 1
    }
    if (item.quantity === newQuantity) return; // No change

    this.cartService.updateCartItemQuantity(item.cartItemId, newQuantity).subscribe({
      next: () => {
        this.successMessage = 'Cart updated successfully!';
        this.errorMessage = '';
        // Optionally, refresh local state or reload cart
        // item.quantity = newQuantity; // Update local state directly
        this.loadCartItems(); // Reload to ensure consistency
      },
      error: (err) => {
        this.errorMessage = 'Failed to update quantity. Please try again.';
        this.successMessage = '';
        console.error('Error updating cart item quantity:', err);
      }
    });
  }

  removeItem(cartItemId: number): void {
    this.cartService.removeCartItem(cartItemId).subscribe({
      next: () => {
        this.successMessage = 'Item removed from cart!';
        this.errorMessage = '';
        this.loadCartItems(); // Reload cart after removal
      },
      error: (err) => {
        this.errorMessage = 'Failed to remove item. Please try again.';
        this.successMessage = '';
        console.error('Error removing cart item:', err);
      }
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.errorMessage = 'Your cart is empty. Add items before checking out.';
      return;
    }
    this.router.navigate(['/checkout']);
  }
}

