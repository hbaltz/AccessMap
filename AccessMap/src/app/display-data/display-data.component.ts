import { Component } from '@angular/core';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-display-data',
  imports: [MapComponent],
  templateUrl: './display-data.component.html',
  styleUrl: './display-data.component.css',
})
export class DisplayDataComponent {}
