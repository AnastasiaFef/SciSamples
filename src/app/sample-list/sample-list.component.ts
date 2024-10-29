import { Component, OnInit } from '@angular/core';
import { SampleCardComponent } from '../sample-card/sample-card.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { Sample } from '../interfaces/sample.interface';
import { SampleService } from '../services/sample.service'
import { ActivatedRoute, Router } from '@angular/router';
import { SessionCacheService } from '../services/session-cache.service';

@Component({
  selector: 'app-sample-list',
  standalone: true,
  imports: [ SampleCardComponent, CommonModule ],
  templateUrl: './sample-list.component.html',
  styleUrl: './sample-list.component.css'
})
export class SampleListComponent implements OnInit{
  samples$!: Observable<Sample[]>;
  samples: Sample[] = [];
  currentPage!: number;
  isLastPage: boolean = false;

  constructor(
    private sampleService: SampleService,
    private sessionCacheService: SessionCacheService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.loadSamples();
    });
  }

  loadSamples() {
    this.sessionCacheService.getOrFetch(this.currentPage, () => this.sampleService.getSamples(this.currentPage))
    .subscribe({
      next: ({ samples, isLastPage }) => {
        this.samples = [...samples];
        this.isLastPage = isLastPage;
      },
      error: (error) => {
        console.error('Error fetching samples:', error);
      }
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
    });
  }
}
