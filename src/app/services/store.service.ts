import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

const STORE_BASE_URL = 'https://fakestoreapi.com';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  getAllProducts(size = '12', sort = 'asc', page='1', category?:string): Observable<Product[]> {
    return this.http.get<Product[]>(`${STORE_BASE_URL}/products${
      category ? '/category/'+category :''
    }?limit=${size}&sort=${sort}&page=${page}`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${STORE_BASE_URL}/products/categories`);
  }
}
