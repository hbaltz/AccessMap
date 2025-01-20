import { Injectable } from '@angular/core';
import { ApiGeolocationService } from '../api/api-geolocation.service';
import { map, Observable } from 'rxjs';
import { MAP } from '../../map/models/map.model';
import { MappingActiviteIcon } from './activiteIcon.mapping';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  constructor(private apiGeolocationService: ApiGeolocationService) {}

  public getBuildings(): Observable<MAP.Buidling[]> {
    return this.apiGeolocationService.get_buildings_pagined(100).pipe(
      map((buildingFeatureCollection) => {
        return (
          buildingFeatureCollection.features?.map((f) => {
            return {
              id: f.properties ? <string>f.properties['uuid'] : '',
              name: f.properties ? <string>f.properties['nom'] : 'Inconnu',
              icon: f.properties
                ? this.getIconFromActiviteIcon(
                    f.properties['activite']['vector_icon']
                  )
                : MappingActiviteIcon['default'],
              activite: f.properties
                ? <string>f.properties['activite']['nom']
                : 'Inconnu',
              gps_coord: f.geometry.coordinates,
            };
          }) || []
        );
      })
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
