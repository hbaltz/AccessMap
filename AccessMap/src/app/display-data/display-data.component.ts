import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MapComponent } from './map/map.component';
import { BuildingsListComponent } from './buildings-list/buildings-list.component';
import { Subscription } from 'rxjs';
import { DATA } from './models/map.model';
import { BuildingService } from './services/building/building.service';

@Component({
  selector: 'app-display-data',
  imports: [MapComponent, BuildingsListComponent],
  templateUrl: './display-data.component.html',
  styleUrl: './display-data.component.css',
})
export class DisplayDataComponent implements OnInit, OnDestroy {
  public buildingArray: DATA.Buidling[] = [];

  private buildingService: BuildingService = inject(BuildingService);
  private subscriptionArray: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptionArray.push(
      this.buildingService
        .getBuildings()
        .subscribe((buildings) => (this.buildingArray = buildings))
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionArray.forEach((s) => s.unsubscribe());
  }
}
