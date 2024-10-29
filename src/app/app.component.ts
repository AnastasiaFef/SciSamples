import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SampleListComponent } from './sample-list/sample-list.component';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SampleListComponent,
    AngularFireModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  firestore: Firestore = inject(Firestore);

  title = 'samples';
}
