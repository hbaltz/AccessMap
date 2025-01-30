import { Component, inject, Signal } from '@angular/core';
import { BuildingDataService } from '../../services/building-data/building-data.service';
import { TooltipDirective } from '../../../common/directives/tooltip.directive';
import { I18nPluralPipe } from '@angular/common';
import { BuildingFilterComponent } from './building-filter/building-filter.component';

@Component({
  selector: 'app-header-information',
  imports: [TooltipDirective, I18nPluralPipe, BuildingFilterComponent],
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
