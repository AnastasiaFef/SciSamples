import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, switchMap } from 'rxjs';
import { PageData, Sample } from '../interfaces/sample.interface';

import { collection, collectionData, Firestore, getCountFromServer, limit, orderBy, query, startAt } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  totalSamplesSubject = new ReplaySubject<number>(1);
  totalSamples$ = this.totalSamplesSubject.asObservable();
  pageSize: number = 5;

  constructor(private firestore: Firestore) {
    this.getTotalDocumentCount();
  }

  getSamples(currentPage: number): Observable<PageData> {
    return this.totalSamples$.pipe(
      switchMap(totalSamples => {
        const firstItemId = ((currentPage - 1) * this.pageSize + 1);
        const fisrtItem = 'sample' + firstItemId.toString().padStart(3, '0');
        const isLastPage = firstItemId + this.pageSize > totalSamples;

        const samplesQuery = query(
          collection(this.firestore, 'samples'),
          orderBy('sampleId'),
          startAt(fisrtItem),
          limit(this.pageSize)
        );

        const samples$ = collectionData(samplesQuery) as Observable<Sample[]>;

        return samples$.pipe(
          map(samples => ({ samples, isLastPage }))
        );
      })
    )
  }

  private async getTotalDocumentCount() {
    const coll = collection(this.firestore, 'samples');
    const snapshot = await getCountFromServer(coll);
    const count = snapshot.data().count;
    this.totalSamplesSubject.next(count);
  }
}
