import {
  computed,
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  AccesLibreFeatureCollectionResponse,
  ApiGeolocationService,
} from '../api/api-geolocation.service';
import { map, Observable, tap, throwError } from 'rxjs';
import { DATA } from '../../models/map.model';
import { MappingActiviteIcon } from './activiteIcon.mapping';

const NUMBER_BUILGINGS_PER_PAGE = 100;

function getIconFromActiviteIcon(activiteIconName: string): string {
  if (activiteIconName && activiteIconName in MappingActiviteIcon) {
    return MappingActiviteIcon[activiteIconName];
  } else {
    console.error('unknow activite', activiteIconName);
    return MappingActiviteIcon['default'];
  }
}

function transormFeaturesCollectionToBuildings(
  buildingFeatureCollection: AccesLibreFeatureCollectionResponse,
): DATA.Buidling[] {
  return (
    buildingFeatureCollection.features?.map((f) => {
      return {
        id: f.properties ? (f.properties['uuid'] as string) : '',
        name: f.properties ? (f.properties['nom'] as string) : 'Nom inconnu',
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

  public getBuildings(): Observable<DATA.Buidling[]> {
    return this.apiGeolocationService
      .get_buildings_pagined(NUMBER_BUILGINGS_PER_PAGE)
      .pipe(
        tap((buildingFeatureCollection) => {
          this.numberOfBuildings.set(buildingFeatureCollection.count);
          this.nextBuildingUrl.set(buildingFeatureCollection.next);
        }),
        map(transormFeaturesCollectionToBuildings),
        tap((buildings) =>
          this.numberOfDisplayedBuildings.set(buildings.length),
        ),
      );
  }

  public hasNextPage(): Signal<boolean> {
    return computed(() => this.nextBuildingUrl() !== null);
  }

  public loadNextBuildingsPage(): Observable<DATA.Buidling[]> {
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
}
