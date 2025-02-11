import {
  computed,
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  combineLatest,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { DATA } from '../../models/data.model';
import { MapService } from '../map/map.service';
import { BuildingLoadingService } from '../building-loading/building-loading.service';
import { capitalizeFirstLetter } from '../../../common/utils/capitalize-first-letter';
import { ApiBuildingService } from '../api/api-building.service';
import { API_DATA } from '../../models/api-data.model';
import { BuildingFilterService } from '../building-filter/building-filter.service';

const NUMBER_BUILGINGS_PER_PAGE: number = 500;

function transormBuildingResponseToBuildings(
  builgListResponse: API_DATA.BuildingListResponse,
): DATA.Building[] {
  return (
    builgListResponse.results.map((buildingResponse) => {
      return {
        id: buildingResponse.uuid,
        name: capitalizeFirstLetter(buildingResponse.name),
        icon: buildingResponse.activity.icon,
        activite: capitalizeFirstLetter(buildingResponse.activity.name),
        address: buildingResponse.address,
        gps_coord: [buildingResponse.longitude, buildingResponse.latitude],
        slug: buildingResponse.uuid, // TODO: delete that after transition
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
export class BuildingData2Service {
  private apiBuildingService: ApiBuildingService = inject(ApiBuildingService);

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
    return combineLatest([
      this.buildingFilterService.getPostalCodeFilter(),
      this.mapService.getBoundsSelected(),
    ]).pipe(
      tap(() => this.buildingLoadingService.hasStartLoadingBuildingData()),
      switchMap(([postalCode, bounds]) =>
        this.apiBuildingService.get_buildings_pagined(
          NUMBER_BUILGINGS_PER_PAGE,
          postalCode,
          bounds,
        ),
      ),

      tap((builgListResponse) => {
        this.numberOfBuildings.set(builgListResponse.total_count);
        this.nextBuildingUrl.set(builgListResponse.next);
      }),
      map(transormBuildingResponseToBuildings),
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
      return this.apiBuildingService
        .get_buildings_next_page(this.nextBuildingUrl() as string)
        .pipe(
          tap((buildingFeatureCollection) => {
            this.nextBuildingUrl.set(buildingFeatureCollection.next);
          }),
          map(transormBuildingResponseToBuildings),
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
