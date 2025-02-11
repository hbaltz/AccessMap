import { Component, inject, Signal } from '@angular/core';
import { TooltipDirective } from '../../../common/directives/tooltip.directive';
import { I18nPluralPipe } from '@angular/common';
import { BuildingFilterComponent } from './building-filter/building-filter.component';
import { BuildingData2Service } from '../../services/building-data-2/building-data-2.service';

@Component({
  selector: 'app-header-information',
  imports: [TooltipDirective, I18nPluralPipe, BuildingFilterComponent],
  templateUrl: './header-information.component.html',
  styleUrl: './header-information.component.css',
})
export class HeaderInformationComponent {
  private buildingDataService: BuildingData2Service =
    inject(BuildingData2Service);

  public numberOfBuildings: Signal<number> =
    this.buildingDataService.getnumberOfBuildings();

  public numberOfDsiplayedBuildings: Signal<number> =
    this.buildingDataService.getNumberOfDsiplayedBuildings();

  public countBuildingDisplay: Record<string, string> = {
    '=0': "il n'y a aucun établissement référencé.",
    '=1': 'il y a un établissement référencé.',
    other: 'il y a # établissements référencés.',
  };

  public countDisplayedBuildingDisplay: Record<string, string> = {
    '=0': "Aucun établissement n'est actuellement affiché.",
    '=1': 'Un établissement est actuellement affiché.',
    other: '# établissements sont actuellement affichés.',
  };
}
