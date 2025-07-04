import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service'; // To get user ID

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile: any = {
    userId: null, // Will be populated from backend
    username: '',
    email: '',
    address: '',
    phoneNumber: ''
  };
  originalProfile: any; // To check for changes
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = true;
  isUpdating: boolean = false;
  userId: number = 1; // Placeholder: Replace with actual logged-in user ID

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // In a real app, get the userId from AuthService (e.g., from decoded JWT token)
    // const userId = this.authService.getUserId();
    // if (userId) {
    //   this.userId = userId;
    //   this.loadUserProfile();
    // } else {
    //   this.errorMessage = 'User not logged in. Please log in to view your profile.';
    //   this.isLoading = false;
    // }
    this.loadUserProfile(); // Using placeholder userId
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getUserProfile(this.userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.originalProfile = { ...data }; // Create a copy for comparison
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.isLoading = false;
        console.error('Error fetching user profile:', err);
      }
    });
  }

  onUpdateProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isUpdating = true;

    // Check if any changes were made
    if (JSON.stringify(this.userProfile) === JSON.stringify(this.originalProfile)) {
      this.errorMessage = 'No changes detected.';
      this.isUpdating = false;
      return;
    }

    this.userService.updateUserProfile(this.userId, this.userProfile).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';
        this.originalProfile = { ...this.userProfile }; // Update original for next comparison
        this.isUpdating = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.isUpdating = false;
        console.error('Error updating user profile:', err);
      }
    });
  }
}

