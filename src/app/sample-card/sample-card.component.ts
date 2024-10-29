import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sample-card',
  standalone: true,
  imports: [ DatePipe ],
  templateUrl: './sample-card.component.html',
  styleUrl: './sample-card.component.css'
})
export class SampleCardComponent {
  @Input() item: any;
  @Input() i!: number;
}
