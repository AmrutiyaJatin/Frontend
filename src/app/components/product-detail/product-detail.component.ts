import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service'; // To get user ID
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule], // Added FormsModule
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  productId: number | null = null;
  product: any = null;
  quantity: number = 1;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = true;
  isLoggedIn: boolean = false; // To control add to cart button visibility

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn(); // Check initial login status
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status; // Update login status dynamically
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id; // Convert string to number
        this.fetchProductDetails(this.productId);
      } else {
        this.errorMessage = 'Product ID not found.';
        this.isLoading = false;
      }
    });
  }

  fetchProductDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load product details.';
        this.isLoading = false;
        console.error('Error fetching product details:', err);
      }
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      this.errorMessage = 'Please log in to add items to your cart.';
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product || !this.productId) {
      this.errorMessage = 'Cannot add to cart: Product data missing.';
      return;
    }

    // You'll need a way to get the current user's ID.
    // This typically comes from the JWT token or a user service after login.
    // For now, let's use a placeholder or assume a method in AuthService returns it.
    // In a real app, you'd decode the token to get the userId.
    const userId = 1; // Placeholder: Replace with actual logged-in user ID

    this.cartService.addToCart(userId, this.productId, this.quantity).subscribe({
      next: (response) => {
        this.successMessage = `${this.quantity} x ${this.product.title} added to cart!`;
        this.errorMessage = '';
        // Optionally, redirect to cart or show a confirmation modal
      },
      error: (err) => {
        this.errorMessage = 'Failed to add product to cart. Please try again.';
        this.successMessage = '';
        console.error('Error adding to cart:', err);
      }
    });
  }
}

