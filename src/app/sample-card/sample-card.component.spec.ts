import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SampleCardComponent } from './sample-card.component';
import { DatePipe } from '@angular/common';

describe('SampleCardComponent', () => {
  let component: SampleCardComponent;
  let fixture: ComponentFixture<SampleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleCardComponent, DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(SampleCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render data from @Input properties correctly', () => {
    const sampleData = {
      date: { toDate: () => new Date('May 20, 2023') },
      userName: 'User001',
      sampleId: 'Sample001',
      labId: 'Lab001'
    };
    component.item = sampleData;
    component.i = 1;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const leftColumn = compiled.querySelector('.left-column');
    const rightColumn = compiled.querySelector('.right-column');

    expect(leftColumn.textContent).toContain('May 20, 2023');
    expect(leftColumn.textContent).toContain('User001');
    expect(rightColumn.textContent).toContain('Sample ID: Sample001');
    expect(rightColumn.textContent).toContain('Laboratory ID: Lab001');
  });

  it('should format the date using DatePipe', () => {
    const sampleData = {
      date: { toDate: () => new Date('May 20, 2023') },
      userName: 'User002',
      sampleId: '002',
      labId: 'Lab002'
    };
    component.item = sampleData;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dateElement = compiled.querySelector('.left-column p:first-child');

    expect(dateElement.textContent).toContain('May 20, 2023');
  });

  it('should display the correct sample ID and lab ID', () => {
    const sampleData = {
      date: { toDate: () => new Date("Oct 01, 2024") },
      userName: 'User003',
      sampleId: 'Sample003',
      labId: 'Lab003'
    };
    component.item = sampleData;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const rightColumn = compiled.querySelector('.right-column');

    expect(rightColumn.textContent).toContain('Sample ID: Sample003');
    expect(rightColumn.textContent).toContain('Laboratory ID: Lab003');
  });
});
