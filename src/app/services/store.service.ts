import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiResponse } from '../interface/api-response';
import { Page } from '../interface/page';


// const STORE_BASE_URL = 'https://fakestoreapi.com';
const STORE_BASE_URL = 'http://localhost:8080/api/v1';

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  constructor(private http: HttpClient) { }

  // getAllProducts(
  //   size = '12',
  //   sort = 'asc',
  //   page = '1',
  //   category?: string
  // ): Observable<Product[]> {
  //   return this.http.get<Product[]>(
  //     `${STORE_BASE_URL}/products${
  //       category ? '/category/' + category : ''
  //     }?limit=${size}&sort=${sort}&page=${page}`
  //   );
  // }

  // getAllCategories(): Observable<string[]> {
  //   return this.http.get<string[]>(`${STORE_BASE_URL}/products/categories`);
  // }

  fetchApiData(keyword: string = '', page: number = 0, size: number = 10, sort: String = 'asc'): Observable<ApiResponse<Page<Product[]>>> {
    return this.http.get<any>(`http://localhost:8080/api/v1/products?keyword=${ keyword }&page=${ page }&size=${ size }&sort=${ sort }`);
  }

  // findProductById(id: number): Observable<ApiResponse<any>> {
  //   return this.http.get<ApiResponse<any>>(`${STORE_BASE_URL}/products/${id}`);
  // }

  findProductById(id: number): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${ STORE_BASE_URL }/products/${ id }`);
  }

  placeOrder(order: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${ STORE_BASE_URL }/orders/new`, order);
  }

  getOrdersForUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${ STORE_BASE_URL }/orders/user/${ userId }`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${ STORE_BASE_URL }/orders/id/${ orderId }`);
  }

  getOrderByOrderNumber(orderNumber: string): Observable<any> {
    return this.http.get<any>(`${ STORE_BASE_URL }/orders/${ orderNumber }`);
  }

  getProductByProductId(productId: string) {
    return this.http.get<any>(`${ STORE_BASE_URL }/products/${ productId }`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put<any>(`${ STORE_BASE_URL }/orders/${ orderId }/status/${ status }`, {});
  }

  updateOrderItemStatus(orderId: string, orderItemId: string, status: string): Observable<any> {
    return this.http.put<any>(`${ STORE_BASE_URL }/orders/${ orderId }/orderItem/${ orderItemId }/status/${ status }`, {});
  }

  getUserByUserId(userId: string) {
    return this.http.get<any>(`${ STORE_BASE_URL }/user/${ userId }`);
  }

  updateUserFirstName(userId: string, firstName: string) {
    return this.http.put<any>(`${ STORE_BASE_URL }/user/${ userId }/first-name`, firstName);
  }

  updateUserLastName(userId: string, lastName: string) {
    return this.http.put<any>(`${ STORE_BASE_URL }/user/${ userId }/last-name`, lastName);
  }

  updateUserEmail(email: string, newEmail: string) {
    return this.http.put<any>(`${ STORE_BASE_URL }/user/update-email`, {}, {
      params: {
        email,
        newEmail
      }
    });
  }

  updateUserPhoneNumber(userId: string, phone: string) {
    return this.http.put<any>(`${ STORE_BASE_URL }/user/${ userId }/phone-number`, phone);
  }

  updateUserAddress(userId: string, address: string) {
    return this.http.put<any>(`${ STORE_BASE_URL }/user/${ userId }/address`, address);
  }

  getInvoiceByInvoiceNumber(invoiceNumber: string) {
    return this.http.get<any>(`${ STORE_BASE_URL }/invoice/${ invoiceNumber }`);
  }

  addToWishlist(productId: number, userId: string): Observable<any> {
    return this.http.post<any>(`${ STORE_BASE_URL }/wishlist/add/${ productId }/${ userId }`, {});
  }

  getProductWishlistStatus(productId: string, userId: string): Observable<any> {
    return this.http.get<any>(`${ STORE_BASE_URL }/wishlist/status/${ productId }/${ userId }`);
  }

  removeFromWishlist(productId: number, userId: string): Observable<any> {
    return this.http.delete<any>(`${ STORE_BASE_URL }/wishlist/remove/${ productId }/${ userId }`);
  }

  getWishlistedProducts(userId: string) {
    return this.http.get<any>(`${ STORE_BASE_URL }/wishlist/all/${ userId }`);
  }

  getProductReviewsForProduct(productId: string) {
    return this.http.get<any>(`${ STORE_BASE_URL }/product-review/all`, { params: { productId } });
  }

  addProductReview(productId: string, userId: String, rating: number, title: String, reviewText: string,): Observable<any> {
    return this.http.post<any>(`${ STORE_BASE_URL }/product-review/add`, { productId, userId, rating, title, reviewText });
  }

  likeReview(reviewId: number): Observable<any> {
    return this.http.post<any>(`${ STORE_BASE_URL }/review-like/review/${ reviewId }/vote/add`, {});
  }

  unlikeReview(reviewId: number): Observable<any> {
    return this.http.delete<any>(`${ STORE_BASE_URL }/review-like/review/${ reviewId }/vote/remove`);
  }
}
