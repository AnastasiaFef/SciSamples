import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Sample {
  date: Date;
  userName: string;
  sampleId: string;
  labId: string;
}

export interface PageData {
  samples: Sample[];
  isLastPage: boolean;
}
