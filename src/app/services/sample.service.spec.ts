import { TestBed } from '@angular/core/testing';
import { SampleService } from './sample.service';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { PageData, Sample } from '../interfaces/sample.interface';

const mockCollectionData = jasmine.createSpy('collectionData').and.returnValue(of([]));

describe('SampleService', () => {
  let service: SampleService;
  let firestore: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    firestore = jasmine.createSpyObj('Firestore', {
      collection: () => ({
        get: () => mockCollectionData(),
      }),
    });

    TestBed.configureTestingModule({
      providers: [
        SampleService,
        { provide: Firestore, useValue: firestore },
      ]
    });

    service = TestBed.inject(SampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get samples with correct pagination', (done) => {
    const currentPage = 1;
    const mockSamples: Sample[] = [
      { sampleId: 'sample001', labId: 'lab001', userName: 'User1', date: new Date() },
      { sampleId: 'sample002', labId: 'lab002', userName: 'User2', date: new Date() }
    ];

    mockCollectionData.and.returnValue(of(mockSamples));

    service.totalSamplesSubject.next(10);

    service.getSamples(currentPage).subscribe((data: PageData) => {
      expect(data.samples).toEqual(mockSamples);
      expect(data.isLastPage).toBeFalse();
      done();
    });
  });

  it('should determine if the current page is the last page', (done) => {
    const currentPage = 3;
    const totalSamples = 10;

    service.totalSamplesSubject.next(totalSamples);

    service.getSamples(currentPage).subscribe(data => {
      expect(data.isLastPage).toBeTrue();
      done();
    });
  });
});
