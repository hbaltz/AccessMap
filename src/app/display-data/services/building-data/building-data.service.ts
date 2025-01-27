import {
  computed,
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ApiGeolocationService } from '../api/api-geolocation.service';
import { map, Observable, switchMap, tap, throwError } from 'rxjs';
import { DATA } from '../../models/data.model';
import { MappingActiviteIcon } from './icon-mappings/activiteIcon.mapping';
import { MapService } from '../map/map.service';
import { BuildingLoadingService } from '../building-loading/building-loading.service';
import { API_ACCESS_LIBRE } from '../../models/api-access-libre.model';
import { MappingEquipementIcon } from './icon-mappings/equipementIcon.mapping';
import { capitalizeFirstLetter } from '../../../common/utils/capitalize-first-letter';
import { BuildingFilterService } from '../building-filter/building-filter.service';

const NUMBER_BUILGINGS_PER_PAGE: number = 100;

function getIconFromActiviteIcon(activiteIconName: string): string {
  if (activiteIconName && activiteIconName in MappingActiviteIcon) {
    return MappingActiviteIcon[activiteIconName];
  } else {
    console.error('unknow activite', activiteIconName);
    return MappingActiviteIcon['default'];
  }
}

function getIconFromEquipementIcon(equipementTypeName: string): string {
  if (equipementTypeName && equipementTypeName in MappingEquipementIcon) {
    return MappingEquipementIcon[equipementTypeName];
  } else {
    console.error('unknow equipement type', equipementTypeName);
    return MappingEquipementIcon['default'];
  }
}

function getLastUrlSegment(url: string): string {
  const splittedUrl: string[] = url.split('/');
  const lastChar: string = url.substring(url.length - 1);
  if (lastChar === '/') {
    return splittedUrl[splittedUrl.length - 2];
  } else {
    return splittedUrl[splittedUrl.length - 1];
  }
}

function transormFeaturesCollectionToBuildings(
  buildingFeatureCollection: API_ACCESS_LIBRE.FeatureCollectionResponse,
): DATA.Building[] {
  return (
    buildingFeatureCollection.features?.map((f) => {
      return {
        id: f.properties ? (f.properties['uuid'] as string) : '',
        name: f.properties
          ? capitalizeFirstLetter(f.properties['nom'] as string)
          : 'Nom inconnu',
        icon:
          f.properties &&
          f.properties['activite'] &&
          f.properties['activite']['vector_icon']
            ? getIconFromActiviteIcon(f.properties['activite']['vector_icon'])
            : MappingActiviteIcon['default'],
        activite:
          f.properties &&
          f.properties['activite'] &&
          f.properties['activite']['nom']
            ? (f.properties['activite']['nom'] as string)
            : 'Activité inconnue',
        adress: f.properties
          ? (f.properties['adresse'] as string)
          : 'Adresse inconnues',
        gps_coord: f.geometry.coordinates,
        slug:
          f.properties && f.properties['web_url']
            ? getLastUrlSegment(f.properties['web_url'])
            : '',
      };
    }) || []
  );
}

/**
 * Responsible of the data management of the buildings
 */
@Injectable({
  providedIn: 'root',
})
export class BuildingDataService {
  private apiGeolocationService: ApiGeolocationService = inject(
    ApiGeolocationService,
  );
  private mapService: MapService = inject(MapService);
  private buildingLoadingService: BuildingLoadingService = inject(
    BuildingLoadingService,
  );
  private buildingFilterService: BuildingFilterService = inject(
    BuildingFilterService,
  );

  private numberOfBuildings: WritableSignal<number> = signal<number>(0);
  private numberOfDisplayedBuildings: WritableSignal<number> =
    signal<number>(0);
  private nextBuildingUrl: WritableSignal<string | null> = signal<
    string | null
  >(null);

  public getnumberOfBuildings(): Signal<number> {
    return this.numberOfBuildings;
  }

  public getNumberOfDsiplayedBuildings(): Signal<number> {
    return this.numberOfDisplayedBuildings;
  }

  public getBuildings(): Observable<DATA.Building[]> {
    return this.buildingFilterService.getPostalCodeFilter().pipe(
      tap(() => this.buildingLoadingService.hasStartLoadingBuildingData()),
      switchMap((postalCode) => {
        if (!postalCode) {
          return this.mapService.getBoundsSelected().pipe(
            tap(() =>
              this.buildingLoadingService.hasStartLoadingBuildingData(),
            ),
            switchMap((bounds) => {
              return this.apiGeolocationService.get_buildings_pagined_by_bounds(
                NUMBER_BUILGINGS_PER_PAGE,
                bounds,
              );
            }),
          );
        } else {
          return this.apiGeolocationService.get_buildings_pagined_by_postal_code(
            NUMBER_BUILGINGS_PER_PAGE,
            postalCode,
          );
        }
      }),
      tap((buildingFeatureCollection) => {
        this.numberOfBuildings.set(buildingFeatureCollection.count);
        this.nextBuildingUrl.set(buildingFeatureCollection.next);
      }),
      map(transormFeaturesCollectionToBuildings),
      tap((buildings) => {
        this.numberOfDisplayedBuildings.set(buildings.length);
        this.buildingLoadingService.hasStopLoadingBuildingData();
      }),
    );
  }

  public hasNextPage(): Signal<boolean> {
    return computed(() => this.nextBuildingUrl() !== null);
  }

  public loadNextBuildingsPage(): Observable<DATA.Building[]> {
    if (this.hasNextPage()()) {
      return this.apiGeolocationService
        .get_buildings_next_page(this.nextBuildingUrl() as string)
        .pipe(
          tap((buildingFeatureCollection) => {
            this.nextBuildingUrl.set(buildingFeatureCollection.next);
          }),
          map(transormFeaturesCollectionToBuildings),
          tap((buildings) =>
            this.numberOfDisplayedBuildings.set(
              this.numberOfDisplayedBuildings() + buildings.length,
            ),
          ),
        );
    } else {
      return throwError(() => new Error('No more buildings to load'));
    }
  }

  public getBuildingDetails(
    slug: string,
  ): Observable<DATA.BuildingDetailsSection[]> {
    return this.apiGeolocationService.get_building_info(slug).pipe(
      map((buildingsApiDetails: API_ACCESS_LIBRE.BuildingDetails) => {
        return buildingsApiDetails.sections.map((section) => {
          return {
            title: capitalizeFirstLetter(section.title),
            labels: section.labels.map((label) => capitalizeFirstLetter(label)),
            icon: getIconFromEquipementIcon(section.title),
          };
        });
      }),
    );
  }
}
