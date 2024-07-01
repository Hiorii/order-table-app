import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrdersData(): Observable<{ data: OrderModel[] }> {
    return this.http.get<{ data: OrderModel[] }>(this.url);
  }
}
