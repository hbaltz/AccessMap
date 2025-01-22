import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { BuildingsListComponent } from './components/buildings-list/buildings-list.component';
import { Subscription } from 'rxjs';
import { DATA } from './models/map.model';
import { BuildingDataService } from './services/building-data/building-data.service';
import { HeaderInformationComponent } from './components/header-information/header-information.component';

@Component({
  selector: 'app-display-data',
  imports: [MapComponent, BuildingsListComponent, HeaderInformationComponent],
  templateUrl: './display-data.component.html',
  styleUrl: './display-data.component.css',
})
export class DisplayDataComponent implements OnInit, OnDestroy {
  public buildingArray: DATA.Buidling[] = [];
  public addedBuildingForMap: DATA.Buidling[] = [];

  public isLoading: boolean = false;

  private buildingDataService: BuildingDataService =
    inject(BuildingDataService);
  private subscriptionArray: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptionArray.push(
      this.buildingDataService
        .getBuildings()
        .subscribe((buildings) => (this.buildingArray = buildings))
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionArray.forEach((s) => s.unsubscribe());
  }

  public launchNextPageLoading(): void {
    this.buildingDataService.loadNextBuildingsPage().subscribe((buildings) => {
      this.buildingArray.push(...buildings);
      this.addedBuildingForMap = buildings;
      this.isLoading = false;
    });
  }
}
