import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellService } from '../../services/sell.service';
import { AuthService } from '../../services/auth.service'; // To get user ID
import { Router } from '@angular/router';

@Component({
  selector: 'app-sell-furniture',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sell-furniture.component.html',
  styleUrl: './sell-furniture.component.css'
})
export class SellFurnitureComponent {
  sellRequest = {
    userId: 1, // Placeholder: Replace with actual logged-in user ID
    title: '',
    description: '',
    expectedPrice: null as number | null,
    imageUrl: '' // This will store the URL after "upload"
  };
  selectedFile: File | null = null;
  message: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;
  userId: number = 1;

  constructor(
    private sellService: SellService,
    private authService: AuthService,
    private router: Router
  ) {
    // In a real app, get the userId from AuthService (e.g., from decoded JWT token)
    // const userId = this.authService.getUserId();
    // if (userId) {
    //   this.sellRequest.userId = userId;
    // } else {
    //   this.errorMessage = 'User not logged in. Please log in to sell furniture.';
    //   // Potentially redirect to login
    // }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      // In a real application, you would upload this file to a storage service
      // (e.g., Azure Blob Storage, AWS S3) and get a URL back.
      // For this example, we'll just simulate a URL.
      this.sellRequest.imageUrl = `https://placehold.co/600x400/e0e0e0/555555?text=Image+of+${this.selectedFile.name.substring(0, 10)}`;
      this.message = `File selected: ${this.selectedFile.name}`;
      this.errorMessage = '';
    } else {
      this.sellRequest.imageUrl = '';
      this.message = '';
    }
  }

  onSubmitSellRequest(): void {
    this.message = '';
    this.errorMessage = '';

    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image for your furniture.';
      return;
    }
    if (!this.sellRequest.title || !this.sellRequest.description) {
      this.errorMessage = 'Please fill in all required fields (Title, Description).';
      return;
    }

    this.isSubmitting = true;

    // In a real scenario, you'd perform the actual image upload here first,
    // then use the returned URL to populate sellRequest.imageUrl before calling sellService.
    // For this example, we're using a placeholder URL directly.

    this.sellService.submitSellRequest(this.sellRequest).subscribe({
      next: (response) => {
        this.message = 'Your sell request has been submitted successfully! We will review it shortly.';
        this.errorMessage = '';
        this.isSubmitting = false;
        // Optionally, reset the form or navigate
        this.sellRequest = { userId: this.userId, title: '', description: '', expectedPrice: null, imageUrl: '' };
        this.selectedFile = null;
        // this.router.navigate(['/']); // Or to a "my sell requests" page
      },
      error: (err) => {
        this.errorMessage = 'Failed to submit sell request. Please try again.';
        this.message = '';
        this.isSubmitting = false;
        console.error('Sell request error:', err);
      }
    });
  }
}

