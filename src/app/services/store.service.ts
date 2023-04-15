import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators'
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

  getOrderByOrderId(orderId: string): Observable<any> {
    return this.http.get<any>(`${ STORE_BASE_URL }/orders/${ orderId }`);
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

}
