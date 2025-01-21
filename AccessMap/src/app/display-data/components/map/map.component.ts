import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { LeafletMarkerClusterModule } from '@bluehalo/ngx-leaflet-markercluster';
import { DATA } from '../../models/map.model';

@Component({
  selector: 'app-map',
  imports: [LeafletMarkerClusterModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnChanges {
  @Input() public initialBuildingArray: DATA.Buidling[] = [];
  @Input() public newBuildingArray: DATA.Buidling[] = [];

  private geolocationService: GeolocationService = inject(GeolocationService);

  private map!: L.Map;
  private buildingClusterData!: L.MarkerClusterGroup;

  public ngOnInit(): void {
    this.initializeMap();

    this.geolocationService
      .getCurrentLocation()
      .then((position) => {
        this.zoomToLocation(position);
      })
      .catch(console.error);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialBuildingArray']) {
      this.displayBuildginsOnMap(this.initialBuildingArray);
    }

    if (changes['newBuildingArray']) {
      this.displayBuildginsOnMap(this.newBuildingArray);
    }
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
    this.buildingClusterData.addTo(this.map);
  }

  private zoomToLocation(position: GeolocationPosition): void {
    this.map.panTo([position.coords.latitude, position.coords.longitude]);
  }

  private displayBuildginsOnMap(buildingArray: DATA.Buidling[]): void {
    if (buildingArray.length !== 0) {
      buildingArray.forEach((building) => {
        const marker = L.marker(
          [building.gps_coord[1], building.gps_coord[0]],
          {
            icon: L.divIcon({
              html: `<i class="fas fa-${building.icon} blue-dark p-0"></i>`,
              iconSize: [30, 30],
              className: 'icon bg-white',
            }),
          }
        ).bindTooltip(
          `${building.activite} - ${building.name} <br /> ${building.adress}`,
          {
            direction: 'right',
            className: 'tooltip-building',
          }
        );
        this.buildingClusterData.addLayer(marker);
      });
    }
  }
}
