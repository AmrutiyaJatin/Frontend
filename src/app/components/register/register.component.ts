import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    fullName: '', // Changed from username to fullName
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage: string = '';
  successMessage: string = '';
  isRegistering: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isRegistering = true;

    // Prepare payload for backend (exclude confirmPassword, use correct property names)
    const registerPayload = {
      FullName: this.user.fullName,
      Email: this.user.email,
      Password: this.user.password,
      // Role: 'User' // Optional, backend defaults to "User"
    };

    this.authService.register(registerPayload).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! You are now logged in.';
        this.isRegistering = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Please try again or use a different email.';
        this.isRegistering = false;
        console.error('Registration error:', err);
      }
    });
  }
}

