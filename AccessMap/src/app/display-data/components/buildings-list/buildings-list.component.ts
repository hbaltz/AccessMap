import { Component, input, InputSignal, Signal } from '@angular/core';
import { BuildingCardComponent } from '../building-card/building-card.component';
import { DATA } from '../../models/map.model';

@Component({
  selector: 'app-buildings-list',
  imports: [BuildingCardComponent],
  templateUrl: './buildings-list.component.html',
  styleUrl: './buildings-list.component.css',
})
export class BuildingsListComponent {
  public buildingArray: InputSignal<DATA.Buidling[]> =
    input.required<DATA.Buidling[]>();
}
