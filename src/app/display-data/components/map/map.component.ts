import {
  Component,
  effect,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Signal,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import { LeafletMarkerClusterModule } from '@bluehalo/ngx-leaflet-markercluster';
import { DATA } from '../../models/data.model';
import { BuildingSelectionService } from '../../services/building-selection/building-selection.service';
import { debounceTime, fromEvent, Observable, Subscription } from 'rxjs';
import { MapService } from '../../services/map/map.service';

const BG_COLOR_DEFAULT_CLASS: string = 'bg-white';
const BG_COLOR_SELECTED_CLASS: string = 'bg-aquamarine';

const MAP_MIN_ZOOM: number = 6;

@Component({
  selector: 'app-map',
  imports: [LeafletMarkerClusterModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public initialBuildingArray: DATA.Building[] = [];
  @Input() public newBuildingArray: DATA.Building[] = [];

  private geolocationService: GeolocationService = inject(GeolocationService);
  private buildingSelectionService: BuildingSelectionService = inject(
    BuildingSelectionService,
  );
  private mapService: MapService = inject(MapService);

  private map!: L.Map;
  private buildingClusterData!: L.MarkerClusterGroup;
  private mapBuildingIDMarkers = new Map<string, L.Marker>(); // Map of buildingID -> Marker
  private selectedBuildingId: Signal<string | null> =
    this.buildingSelectionService.getSelectedBuildingId();
  // We want to keep track of whether the zoom or move was programmatic or not, so we can only send bounds updates when the user moves the map
  private isZoomOrMoveProgrammatic = false;

  private subscriptionArray: Subscription[] = [];

  public constructor() {
    effect(() => {
      const selectedBuildingId: string | null = this.selectedBuildingId();
      if (selectedBuildingId) {
        this.zoomToSelectedBuildingMarker(selectedBuildingId);
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
      // Clear the map before displaying the new buildings
      if (this.buildingClusterData) {
        this.buildingClusterData.clearLayers();
      }
      this.displayBuildginsOnMap(this.initialBuildingArray);
    }

    if (changes['newBuildingArray']) {
      this.displayBuildginsOnMap(this.newBuildingArray);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptionArray.forEach((s) => s.unsubscribe());
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([47, 2], 6);

    this.map.setMinZoom(MAP_MIN_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.buildingClusterData = L.markerClusterGroup({
      removeOutsideVisibleBounds: true,
    });
    this.buildingClusterData.addTo(this.map);

    this.buildingClusterData.on('clusterclick', () => {
      // We set to true to avoid the map moved or zoomed event to trigger an update of data in this case
      this.isZoomOrMoveProgrammatic = true;
    });

    this.subscriptionArray.push(
      this.surveyOnZoomendAndOnmoveend().subscribe(() => {
        if (this.isZoomOrMoveProgrammatic) {
          this.isZoomOrMoveProgrammatic = false;
        } else {
          this.updateSelectedBounds();
        }
      }),
    );
  }

  private zoomToLocation(position: GeolocationPosition): void {
    this.map.panTo([position.coords.latitude, position.coords.longitude]);
  }

  private displayBuildginsOnMap(buildingArray: DATA.Building[]): void {
    if (buildingArray.length !== 0) {
      const selectBuildingId: string | null =
        this.buildingSelectionService.getSelectedBuildingId()();

      buildingArray.forEach((building) => {
        const marker: L.Marker = L.marker(
          [building.gps_coord[1], building.gps_coord[0]],
          {
            icon: L.divIcon({
              html: `<i class="fas fa-${building.icon} blue-dark p-0"></i>`,
              iconSize: [30, 30],
              className: 'icon bg-white',
            }),
            // @ts-expect-error: Custom property
            building: building,
          },
        );
        marker.bindTooltip(
          `${building.activite} - ${building.name} <br /> ${building.adress}`,
          {
            direction: 'right',
            className: 'tooltip-building',
          },
        );

        marker.on('click', (event) => {
          this.buildingSelectionService.setSelectedBuilding(
            event.target.options.building,
          );
        });

        if (
          selectBuildingId &&
          building.id &&
          building.id === selectBuildingId
        ) {
          this.updateMarkerClass(marker);
        }

        this.buildingClusterData.addLayer(marker);

        this.mapBuildingIDMarkers.set(building.id, marker);
      });
    }
  }

  private zoomToSelectedBuildingMarker(selectedBuildingId: string): void {
    const marker: L.Marker | undefined =
      this.mapBuildingIDMarkers.get(selectedBuildingId);
    if (marker) {
      const currentZoom: number = this.map.getZoom();
      const targetZoom: number = 15;

      // We set to true to avoid the map moved or zoomed event to trigger an update of data in this case
      this.isZoomOrMoveProgrammatic = true;

      // Only zoom if the current zoom level is less than the target zoom
      if (currentZoom < targetZoom) {
        this.map.setView(marker.getLatLng(), targetZoom); // Zoom to the marker
      } else {
        this.map.panTo(marker.getLatLng()); // Pan to the marker without zooming
      }

      this.updateMarkerClass(marker);

      // If the marker is part of a cluster, spiderfy it
      const parentMarker: L.Marker =
        this.buildingClusterData.getVisibleParent(marker);
      if (parentMarker instanceof L.MarkerCluster) {
        parentMarker.spiderfy();
      }
    }
  }

  private updateMarkerClass(selectedBuildingMarker: L.Marker): void {
    // Reset all marker icons to the default class
    this.mapBuildingIDMarkers.forEach((buildingMarker) => {
      const icon: L.Icon = buildingMarker.options.icon as L.Icon;
      icon.options.className = `icon ${BG_COLOR_DEFAULT_CLASS}`;
      buildingMarker.setIcon(icon);
    });

    // Set a new icon with a custom background for the selected marker
    const selectedIcon: L.Icon = selectedBuildingMarker.options.icon as L.Icon;
    selectedIcon.options.className = `icon ${BG_COLOR_SELECTED_CLASS}`;
    selectedBuildingMarker.setIcon(selectedIcon);
  }

  private surveyOnZoomendAndOnmoveend(): Observable<L.LeafletEvent> {
    return fromEvent(this.map, 'zoomend moveend').pipe(debounceTime(600));
  }

  private updateSelectedBounds(): void {
    const bounds: L.LatLngBounds = this.map.getBounds();
    this.mapService.setBoundsSelected({
      minLat: bounds.getSouth(),
      minLng: bounds.getWest(),
      maxLat: bounds.getNorth(),
      maxLng: bounds.getEast(),
    });
  }
}
