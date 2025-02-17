import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { BuildingsListComponent } from './components/buildings-list/buildings-list.component';
import { Subscription } from 'rxjs';
import { DATA } from './models/data.model';
import { HeaderInformationComponent } from './components/header-information/header-information.component';
import { SpinnerLeakyComponent } from '../common/components/spinners/spinner-leaky/spinner-leaky.component';
import { BuildingLoadingService } from './services/building-loading/building-loading.service';
import { BuildingDetailsComponent } from './components/building-details/building-details.component';
import { BuildingSelectionService } from './services/building-selection/building-selection.service';
import { BuildingData2Service } from './services/building-data/building-data.service';

@Component({
  selector: 'app-display-data',
  imports: [
    MapComponent,
    BuildingsListComponent,
    BuildingDetailsComponent,
    HeaderInformationComponent,
    SpinnerLeakyComponent,
  ],
  templateUrl: './display-data.component.html',
  styleUrl: './display-data.component.css',
})
export class DisplayDataComponent implements OnInit, OnDestroy {
  public buildingArray: DATA.Building[] = [];
  public addedBuildingForMap: DATA.Building[] = [];

  public isListLoading = false;
  public isDetailsVisible = false;

  private buildingData2Service: BuildingData2Service =
    inject(BuildingData2Service);

  private buildingLoadingService: BuildingLoadingService = inject(
    BuildingLoadingService,
  );
  private buildingSelectionService: BuildingSelectionService = inject(
    BuildingSelectionService,
  );
  private subscriptionArray: Subscription[] = [];

  public isBuildingDataLoading: Signal<boolean> =
    this.buildingLoadingService.getIsBuildingDataLoading();
  public selectBuilding: Signal<DATA.Building | null> =
    this.buildingSelectionService.getSelectedBuilding();

  public constructor() {
    effect(() => {
      const selectedBuilding: DATA.Building | null = this.selectBuilding();
      if (selectedBuilding) {
        this.isDetailsVisible = true;
      }
    });
  }

  public ngOnInit(): void {
    /*  this.subscriptionArray.push(
      this.buildingDataService
        .getBuildings()
        .subscribe((buildings) => (this.buildingArray = buildings)),
    ); */

    this.subscriptionArray.push(
      this.buildingData2Service
        .getBuildings()
        .subscribe((buildings) => (this.buildingArray = buildings)),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionArray.forEach((s) => s.unsubscribe());
  }

  public launchNextPageLoading(): void {
    this.buildingData2Service.loadNextBuildingsPage().subscribe((buildings) => {
      this.buildingArray.push(...buildings);
      this.addedBuildingForMap = buildings;
      this.isListLoading = false;
    });
  }
}
