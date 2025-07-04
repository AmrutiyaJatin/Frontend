import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };
  errorMessage: string = '';
  isLoggingIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = '';
    this.isLoggingIn = true;
    this.authService.login(this.user).subscribe({
      next: (response) => {
        // Assuming your backend returns a token upon successful login
        // Token is already set by AuthService tap operator
        this.isLoggingIn = false;
        this.router.navigate(['/']); // Redirect to home or dashboard
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.isLoggingIn = false;
        console.error('Login error:', err);
      }
    });
  }
}

