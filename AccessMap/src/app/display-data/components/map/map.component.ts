import {
  Component,
  effect,
  inject,
  Input,
  OnChanges,
  OnInit,
  Signal,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { LeafletMarkerClusterModule } from '@bluehalo/ngx-leaflet-markercluster';
import { DATA } from '../../models/map.model';
import { BuildingSelectionService } from '../../services/building-selection/building-selection.service';

const BG_COLOR_DEFAULT_CLASS = 'bg-white';
const BG_COLOR_SELECTED_CLASS = 'bg-aquamarine';

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
  private buildingSelectionService: BuildingSelectionService = inject(
    BuildingSelectionService
  );

  private map!: L.Map;
  private buildingClusterData!: L.MarkerClusterGroup;
  private mapBuildingIDMarkers: Map<string, L.Marker> = new Map(); // Map of buildingID -> Marker
  private selectedBuildingId: Signal<string | null> =
    this.buildingSelectionService.getSelectedBuildingId();

  constructor() {
    effect(() => {
      const buildingId = this.selectedBuildingId();
      if (buildingId) {
        this.zoomToBuildingMarker(buildingId);
      }
    });
  }

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
            //@ts-ignore: Custom property
            buildingId: building.id,
          }
        );
        marker.bindTooltip(
          `${building.activite} - ${building.name} <br /> ${building.adress}`,
          {
            direction: 'right',
            className: 'tooltip-building',
          }
        );

        marker.on('click', (event) => {
          this.buildingSelectionService.setSelectedBuildingId(
            event.target.options.buildingId
          );
        });

        this.buildingClusterData.addLayer(marker);

        this.mapBuildingIDMarkers.set(building.id, marker);
      });
    }
  }

  private zoomToBuildingMarker(buildingId: string): void {
    const marker = this.mapBuildingIDMarkers.get(buildingId);
    if (marker) {
      const currentZoom = this.map.getZoom();
      const targetZoom = 15;

      // Only zoom if the current zoom level is less than the target zoom
      if (currentZoom < targetZoom) {
        this.map.setView(marker.getLatLng(), targetZoom); // Zoom to the marker
      } else {
        this.map.panTo(marker.getLatLng()); // Pan to the marker without zooming
      }

      this.updateMarkerClass(marker);

      // If the marker is part of a cluster, spiderfy it
      const parentMarker = this.buildingClusterData.getVisibleParent(marker);
      if (parentMarker instanceof L.MarkerCluster) {
        parentMarker.spiderfy();
      }
    }
  }

  private updateMarkerClass(selectedBuildingMarker: L.Marker): void {
    // Reset all marker icons to the default class
    this.mapBuildingIDMarkers.forEach((buildingMarker) => {
      const icon = buildingMarker.options.icon as L.Icon;
      icon.options.className = `icon ${BG_COLOR_DEFAULT_CLASS}`;
      buildingMarker.setIcon(icon);
    });

    // Set a new icon with a custom background for the selected marker
    const selectedIcon = selectedBuildingMarker.options.icon as L.Icon;
    selectedIcon.options.className = `icon ${BG_COLOR_SELECTED_CLASS}`;
    selectedBuildingMarker.setIcon(selectedIcon);
  }
}
