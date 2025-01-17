import { Injectable } from '@angular/core';
import { ApiGeolocationService } from '../api/api-geolocation.service';
import { map, Observable } from 'rxjs';
import { MAP } from '../../models/map.model';

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
              name: f.properties ? <string>f.properties['nom'] : undefined,
              gps_coord: f.geometry.coordinates,
            };
          }) || []
        );
      })
    );
  }
}
