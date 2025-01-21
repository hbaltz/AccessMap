import {
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ApiGeolocationService } from '../api/api-geolocation.service';
import { map, Observable, tap } from 'rxjs';
import { DATA } from '../../models/map.model';
import { MappingActiviteIcon } from './activiteIcon.mapping';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private apiGeolocationService: ApiGeolocationService = inject(
    ApiGeolocationService
  );

  private numberOfBuildings: WritableSignal<number> = signal<number>(0);
  private numberOfDisplayedBuildings: WritableSignal<number> =
    signal<number>(0);

  public getnumberOfBuildings(): Signal<number> {
    return this.numberOfBuildings;
  }

  public getNumberOfDsiplayedBuildings(): Signal<number> {
    return this.numberOfDisplayedBuildings;
  }

  public getBuildings(): Observable<DATA.Buidling[]> {
    return this.apiGeolocationService.get_buildings_pagined(100).pipe(
      tap((buildingFeatureCollection) =>
        this.numberOfBuildings.set(buildingFeatureCollection.count)
      ),
      map((buildingFeatureCollection) => {
        return (
          buildingFeatureCollection.features?.map((f) => {
            return {
              id: f.properties ? <string>f.properties['uuid'] : '',
              name: f.properties ? <string>f.properties['nom'] : 'Nom inconnu',
              icon: f.properties
                ? this.getIconFromActiviteIcon(
                    f.properties['activite']['vector_icon']
                  )
                : MappingActiviteIcon['default'],
              activite: f.properties
                ? <string>f.properties['activite']['nom']
                : 'Activité inconnue',
              adress: f.properties
                ? <string>f.properties['adresse']
                : 'Adresse inconnues',
              gps_coord: f.geometry.coordinates,
            };
          }) || []
        );
      }),
      tap((buildings) => this.numberOfDisplayedBuildings.set(buildings.length))
    );
  }

  private getIconFromActiviteIcon(activiteIconName: string): string {
    if (activiteIconName && activiteIconName in MappingActiviteIcon) {
      return MappingActiviteIcon[activiteIconName];
    } else {
      console.error('unknow activite', activiteIconName);
      return MappingActiviteIcon['default'];
    }
  }
}
