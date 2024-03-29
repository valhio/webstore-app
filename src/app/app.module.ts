import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HeaderComponent} from './components/header/header.component';
import {HomeComponent} from './pages/home/home.component';
import {ProductsHeaderComponent} from './pages/home/components/products-header/products-header.component';
import {FiltersComponent} from './pages/home/components/filters/filters.component';
import {ProductCardComponent} from './pages/home/components/product-card/product-card.component';
import {CartComponent} from './pages/cart/cart.component';
import {CartService} from './services/cart.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SuccessComponent} from './pages/payment/success/success.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {initializeApp, provideFirebaseApp,} from '@angular/fire/app';
import {environment} from '../environments/environment';
// import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import {FIREBASE_OPTIONS} from '@angular/fire/compat';
import {PaymentStatusComponent} from './pages/payment/payment-status/payment-status.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {CheckoutHeaderComponent} from './pages/checkout/checkout-header/checkout-header.component';
import {CheckoutBodyComponent} from './pages/checkout/checkout-body/checkout-body.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {AuthInterceptor} from './interceptor/auth.interceptor';
import {ManagementComponent} from './pages/management/management.component';
import {OrdersComponent} from './pages/home/components/orders/orders.component';
import {MatDialogModule} from '@angular/material/dialog';
import {OrdersManagementComponent} from './pages/management/orders-management/orders-management.component';
import {OrderComponent} from './pages/order/order.component';
import {EditOrderDialogComponent} from './pages/order/edit-order-dialog/edit-order-dialog.component';
import {InvoiceComponent} from './pages/home/components/invoice/invoice.component';
import {ProductComponent} from './pages/home/components/product/product.component';
import {AccountComponent} from './pages/account/account.component';
import {WishlistComponent} from './pages/wishlist/wishlist.component';
import { ProductReviewComponent } from './pages/home/components/product/product-review/product-review.component';
import { LeaveReviewComponent } from './pages/home/components/product/product-review/leave-review/leave-review.component';
import { ListReviewsComponent } from './pages/home/components/product/product-review/list-reviews/list-reviews.component';
import { ProductRatingComponent } from './pages/home/components/product/product-rating/product-rating.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ProductsHeaderComponent,
    FiltersComponent,
    ProductCardComponent,
    CartComponent,
    CheckoutComponent,
    SuccessComponent,
    PageNotFoundComponent,
    PaymentStatusComponent,
    CheckoutHeaderComponent,
    CheckoutBodyComponent,
    LoginComponent,
    RegisterComponent,
    ManagementComponent,
    OrdersComponent,
    OrdersManagementComponent,
    OrderComponent,
    EditOrderDialogComponent,
    InvoiceComponent,
    ProductComponent,
    AccountComponent,
    WishlistComponent,
    ProductReviewComponent,
    LeaveReviewComponent,
    ListReviewsComponent,
    ProductRatingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSidenavModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatBadgeModule,
    MatSnackBarModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    MatDialogModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
  ],
  providers: [CartService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
