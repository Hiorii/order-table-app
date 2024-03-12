import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatFactsService {
  private loadedFacts: string[] = [];

  constructor(private http: HttpClient) {}

  fetchFacts(url: string, count: number = 1): Observable<string[]> {
    return this.http.get<{ data: string[] }>(`${url}/?count=${count}`).pipe(
      map((response) => response.data.filter((fact) => !this.loadedFacts.includes(fact))),
      tap((newFacts) => this.loadedFacts.push(...newFacts))
    );
  }
}
