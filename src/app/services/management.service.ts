import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const STORE_BASE_URL = 'http://localhost:8080/api/v1';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(private http: HttpClient) {}

 
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${STORE_BASE_URL}/orders/management`);
  }
}
