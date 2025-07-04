import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SellService } from '../../services/sell.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  pendingRequests: any[] = [];
  errorMessage = '';
  successMessage = '';
  apiUrl = 'http://localhost:7000/api/sell';

  constructor(
    private sellService: SellService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    this.sellService.getPendingSellRequests().subscribe({
      next: (data) => this.pendingRequests = data,
      error: () => this.errorMessage = 'Failed to load pending requests.'
    });
  }

  approveRequest(request: any) {
    this.sellService.updateSellRequestStatus(request.requestId, 'Approved').subscribe({
      next: () => {
        this.notifyUser(request.email, 'approved');
        this.successMessage = 'Request approved and user notified.';
        this.loadPendingRequests(); // This refreshes the list and removes the approved request
      },
      error: () => this.errorMessage = 'Failed to approve request.'
    });
  }

  rejectRequest(request: any) {
    this.sellService.updateSellRequestStatus(request.requestId, 'Rejected').subscribe({
      next: () => {
        this.notifyUser(request.email, 'rejected'); // <-- FIXED: use email, not userId
        this.successMessage = 'Request rejected and user notified.';
        this.loadPendingRequests();
      },
      error: () => this.errorMessage = 'Failed to reject request.'
    });
  }

 notifyUser(userEmail: string, status: string) {
  const notification = {
    to: userEmail, // <-- lowercase
    subject: status === 'approved'
      ? 'Your Sell Request Was Approved'
      : 'Your Sell Request Was Rejected',
    body: status === 'approved'
      ? 'Congratulations! Your furniture sell request has been approved.'
      : 'Sorry, your furniture sell request has been rejected.'
  };
  this.notificationService.triggerNotificationRaw(notification).subscribe();
}

  calculateExpectedArrival(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }

  getImageUrl(product: any): string {
    if (!product.imageUrl) return 'assets/no-image.png'; // fallback
    if (product.imageUrl.startsWith('http')) return product.imageUrl;
    return 'http://localhost:5094' + product.imageUrl; // adjust port if needed
  }
}
