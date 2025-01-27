import { Component, input, InputSignal } from '@angular/core';
import { DATA } from '../../models/data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-building-card',
  imports: [CommonModule],
  templateUrl: './building-card.component.html',
  styleUrl: './building-card.component.css',
})
export class BuildingCardComponent {
  public building: InputSignal<DATA.Building> = input.required<DATA.Building>();
  public selected: InputSignal<boolean> = input<boolean>(false);
}
