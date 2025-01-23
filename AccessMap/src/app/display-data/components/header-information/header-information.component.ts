import { Component, inject, Signal } from '@angular/core';
import { BuildingDataService } from '../../services/building-data/building-data.service';
import { TooltipDirective } from '../../../common/directives/tooltip.directive';

@Component({
  selector: 'app-header-information',
  imports: [TooltipDirective],
  templateUrl: './header-information.component.html',
  styleUrl: './header-information.component.css',
})
export class HeaderInformationComponent {
  private buildingDataService: BuildingDataService =
    inject(BuildingDataService);

  public numberOfBuildings: Signal<number> =
    this.buildingDataService.getnumberOfBuildings();

  public numberOfDsiplayedBuildings: Signal<number> =
    this.buildingDataService.getNumberOfDsiplayedBuildings();
}
