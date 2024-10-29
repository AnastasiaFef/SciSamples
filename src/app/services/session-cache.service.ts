import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { PageData } from '../interfaces/sample.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionCacheService {
  private cache: { [pageNumber: number]: PageData } = {};

  constructor() { }

  getOrFetch(pageNumber: number, fetchFunction: () => Observable<PageData>): Observable<PageData> {
    if (this.cache.hasOwnProperty(pageNumber)) {
      return of(this.cache[pageNumber]);
    } else {
      const cacheableObservable = fetchFunction().pipe(
        tap(data => this.cache[pageNumber] = data),
        catchError(err => {
          delete this.cache[pageNumber];
          return throwError(() => new Error(err));
        }));
      return cacheableObservable;
    }
  }
}
