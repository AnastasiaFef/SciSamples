import { TestBed } from '@angular/core/testing';
import { SessionCacheService } from './session-cache.service';
import { Observable, of, throwError } from 'rxjs';
import { PageData } from '../interfaces/sample.interface';

describe('SessionCacheService', () => {
  let service: SessionCacheService;
  let fetchFunctionSpy: jasmine.Spy<() => Observable<PageData>>;
  const mockPageData: PageData = {
    samples: [
      { sampleId: 'sample001', date: new Date(), userName: 'User001', labId: 'Lab001' }
    ],
    isLastPage: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionCacheService);

    fetchFunctionSpy = jasmine.createSpy('fetchFunction').and.returnValue(of(mockPageData));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrFetch', () => {
    it('should fetch data and store it in the cache if not already cached', (done) => {
      service.getOrFetch(1, fetchFunctionSpy).subscribe({
        next: (data) => {
          expect(data).toEqual(mockPageData);
          expect(fetchFunctionSpy).toHaveBeenCalledTimes(1);
          expect((service as any).cache[1]).toEqual(mockPageData);
          done();
        },
        error: done.fail,
      });
    });

    it('should return cached data if available', (done) => {
      (service as any).cache[2] = mockPageData;

      service.getOrFetch(2, fetchFunctionSpy).subscribe({
        next: (data) => {
          expect(data).toEqual(mockPageData);
          expect(fetchFunctionSpy).not.toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });

    it('should call fetchFunction and store data if not cached', (done) => {
      service.getOrFetch(3, fetchFunctionSpy).subscribe({
        next: (data) => {
          expect(data).toEqual(mockPageData);
          expect(fetchFunctionSpy).toHaveBeenCalledTimes(1);
          done();
        },
        error: done.fail,
      });
    });

    it('should remove cache entry on fetch error', (done) => {
      fetchFunctionSpy.and.returnValue(throwError(() => new Error('Fetch error')));

      service.getOrFetch(4, fetchFunctionSpy).subscribe({
        next: () => done.fail('Expected an error, but got data'),
        error: (error) => {
          expect(error.message).toBe('Error: Fetch error');
          expect(fetchFunctionSpy).toHaveBeenCalledTimes(1);
          expect((service as any).cache.hasOwnProperty(4)).toBeFalse();
          done();
        },
      });
    });
  });
});
