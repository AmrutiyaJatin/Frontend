import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SellFurnitureComponent } from './components/sell-furniture/sell-furniture.component';
import { AdminComponent } from './components/admin/admin.component'; // Import AdminComponent
import { authGuard } from './auth.guard'; // Import the auth guard

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home - Furniture Portal' }, // Default route
  { path: 'products/:id', component: ProductDetailComponent, title: 'Product Details' },
  { path: 'cart', component: CartComponent, title: 'Your Cart', canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, title: 'Checkout', canActivate: [authGuard] },
  { path: 'order-confirmation/:orderId', component: OrderConfirmationComponent, title: 'Order Confirmed', canActivate: [authGuard] },
  { path: 'order-history', component: OrderHistoryComponent, title: 'Order History', canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'profile', component: ProfileComponent, title: 'User Profile', canActivate: [authGuard] },
  { path: 'sell-furniture', component: SellFurnitureComponent, title: 'Sell Furniture', canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, title: 'Admin Panel', canActivate: [authGuard] }, // Admin route
  { path: '**', redirectTo: '', title: 'Page Not Found' } // Wildcard route for a 404-like redirect
];

