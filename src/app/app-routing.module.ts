import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { SuccessComponent } from './pages/payment/success/success.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PaymentStatusComponent } from './pages/payment/payment-status/payment-status.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { RoleGuard } from './guard/role.guard';
import { ManagementComponent } from './pages/management/management.component';
import { OrdersComponent } from './pages/home/components/orders/orders.component';
import { OrdersManagementComponent } from './pages/management/orders-management/orders-management.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'management', component: ManagementComponent, canActivate: [AuthenticationGuard, RoleGuard], data: { expectedRoles: ['ROLE_SUPER_ADMIN'] } },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthenticationGuard] },
  { path: 'management/orders', component: OrdersManagementComponent, canActivate: [AuthenticationGuard, RoleGuard], data: { expectedRoles: ['ROLE_SUPER_ADMIN', 'ROLE_MANAGER'], } },
  { path: 'payment/success', component: SuccessComponent },
  { path: 'payment/status', component: PaymentStatusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
