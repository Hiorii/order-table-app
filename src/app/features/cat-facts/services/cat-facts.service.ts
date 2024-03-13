import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatFactsService {
  constructor(private http: HttpClient) {}

  fetchFacts(url: string, count: number = 1): Observable<string[]> {
    return this.http.get<{ data: string[] }>(`${url}/?count=${count}`).pipe(map((response) => response.data));
  }
}
