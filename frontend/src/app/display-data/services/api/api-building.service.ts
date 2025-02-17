import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_DATA } from '../../models/api-data.model';
import { MAP } from '../../models/map.model';

@Injectable({
  providedIn: 'root',
})
export class ApiBuildingService {
  private httpClient: HttpClient = inject(HttpClient);

  private acceslibreHeaders!: HttpHeaders;
  private backendUrl!: string;

  public constructor() {
    this.acceslibreHeaders = new HttpHeaders({
      accept: 'application/json',
    });

    if (environment.BACKEND_URL) {
      this.backendUrl = environment.BACKEND_URL;
    } else {
      console.error(
        'Please declare the backend url in the environment file to have a working application',
      );
    }
  }

  public get_buildings_pagined(
    pageSize: number,
    postalCode?: number | null,
    bounds?: MAP.BoxLatLng,
  ): Observable<API_DATA.BuildingListResponse> {
    let optionalQuery: string = '';
    if (postalCode) {
      optionalQuery += `&postal_code=${postalCode}`;
    }
    if (bounds) {
      optionalQuery += `&zone=${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`;
    }

    return this.get<API_DATA.BuildingListResponse>(
      `${this.backendUrl}/v1/buildings/?page_size=${pageSize}${optionalQuery}`,
    );
  }

  public get_buildings_next_page(
    url: string,
  ): Observable<API_DATA.BuildingListResponse> {
    return this.get<API_DATA.BuildingListResponse>(url);
  }

  private get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url, {
      headers: this.acceslibreHeaders,
    });
  }

  public get_building_accessibility_by_id(
    building_id: string,
  ): Observable<API_DATA.BuildingAccessibility[]> {
    return this.get<API_DATA.BuildingAccessibility[]>(
      `${this.backendUrl}/v1/buildings/${building_id}/accessibility`,
    );
  }
}
