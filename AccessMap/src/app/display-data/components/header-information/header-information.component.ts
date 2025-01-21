import { Component, inject, Signal } from '@angular/core';
import { BuildingService } from '../../services/building/building.service';

@Component({
  selector: 'app-header-information',
  imports: [],
  templateUrl: './header-information.component.html',
  styleUrl: './header-information.component.css',
})
export class HeaderInformationComponent {
  private buildingService: BuildingService = inject(BuildingService);

  public numberOfBuildins: Signal<number> =
    this.buildingService.getNumberOfBuildingsSignal();
}
