import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { BuildingService } from './services/building/building.service';
import { Subscription } from 'rxjs';
import { LeafletMarkerClusterModule } from '@bluehalo/ngx-leaflet-markercluster';

@Component({
  selector: 'app-map',
  imports: [LeafletMarkerClusterModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
  private subcriptionArray: Subscription[] = [];

  private map!: L.Map;
  private buildingClusterData!: L.MarkerClusterGroup;

  constructor(
    private geolocationService: GeolocationService,
    private buildingService: BuildingService
  ) {}

  public ngOnInit(): void {
    this.initializeMap();

    this.displayBuildginsOnMap();

    this.geolocationService
      .getCurrentLocation()
      .then((position) => {
        this.zoomToLocation(position);
      })
      .catch(console.error);
  }

  public ngOnDestroy(): void {
    this.subcriptionArray.forEach((s) => s.unsubscribe());
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([47, 2], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.buildingClusterData = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
    });
  }

  private zoomToLocation(position: GeolocationPosition): void {
    this.map.panTo([position.coords.latitude, position.coords.longitude]);
  }

  private displayBuildginsOnMap(): void {
    this.subcriptionArray.push(
      this.buildingService.getBuildings().subscribe((builgingArray) => {
        builgingArray.forEach((building) => {
          const marker = L.marker([
            building.gps_coord[1],
            building.gps_coord[0],
          ]).bindPopup(building.name || 'Unknown');
          this.buildingClusterData.addLayer(marker);
        });
        this.buildingClusterData.addTo(this.map);
      })
    );
  }
}
