import { Component, input, InputSignal, Signal } from '@angular/core';
import { DATA } from '../../models/map.model';

@Component({
  selector: 'app-building-card',
  imports: [],
  templateUrl: './building-card.component.html',
  styleUrl: './building-card.component.css',
})
export class BuildingCardComponent {
  public building: InputSignal<DATA.Buidling> = input.required<DATA.Buidling>();
}
