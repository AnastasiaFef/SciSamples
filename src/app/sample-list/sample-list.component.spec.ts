import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SampleListComponent } from './sample-list.component';
import { SampleService } from '../services/sample.service';
import { SessionCacheService } from '../services/session-cache.service';
import { Sample } from '../interfaces/sample.interface';

describe('SampleListComponent', () => {
  let component: SampleListComponent;
  let fixture: ComponentFixture<SampleListComponent>;
  let sampleServiceMock: jasmine.SpyObj<SampleService>;
  let sessionCacheServiceMock: jasmine.SpyObj<SessionCacheService>;
  let routerMock: jasmine.SpyObj<Router>;
  let routeMock: any;

  beforeEach(async () => {
    sampleServiceMock = jasmine.createSpyObj('SampleService', ['getSamples']);
    sessionCacheServiceMock = jasmine.createSpyObj('SessionCacheService', ['getOrFetch']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    routeMock = { queryParams: of({ page: '1' }) };

    await TestBed.configureTestingModule({
      imports: [SampleListComponent],
      providers: [
        { provide: SampleService, useValue: sampleServiceMock },
        { provide: SessionCacheService, useValue: sessionCacheServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: Router, useValue: routerMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SampleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with query param page number', () => {
    expect(component.currentPage).toBe(1);
    expect(component.samples.length).toBe(0);
    expect(component.isLastPage).toBeFalse();
  });

  it('should load samples on init based on query param', () => {
    const sampleData: Sample[] = [{ sampleId: 'Sample001', userName: 'User001', labId: 'Lab001', date: new Date() }];
    sessionCacheServiceMock.getOrFetch.and.returnValue(of({ samples: sampleData, isLastPage: false }));

    component.ngOnInit();

    expect(sessionCacheServiceMock.getOrFetch).toHaveBeenCalledWith(1, jasmine.any(Function));
    expect(component.samples).toEqual(sampleData);
    expect(component.isLastPage).toBeFalse();
  });

  it('should set isLastPage correctly when it is the last page', () => {
    const sampleData: Sample[] = [{ sampleId: 'Sample002', userName: 'User002', labId: 'Lab002', date: new Date() }];
    sessionCacheServiceMock.getOrFetch.and.returnValue(of({ samples: sampleData, isLastPage: true }));

    component.loadSamples();

    expect(component.samples).toEqual(sampleData);
    expect(component.isLastPage).toBeTrue();
  });

  it('should navigate to the specified page', () => {
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: routeMock,
      queryParams: { page: 2 },
    });
  });
});
