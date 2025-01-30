import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MAP } from '../../models/map.model';
import { API_ACCESS_LIBRE } from '../../models/api-access-libre.model';

@Injectable({
  providedIn: 'root',
})
export class ApiGeolocationService {
  private httpClient: HttpClient = inject(HttpClient);

  private acceslibreHeaders!: HttpHeaders;

  public constructor() {
    this.acceslibreHeaders = new HttpHeaders({
      accept: 'application/geo+json',
    });

    if (environment.ACCES_LIBRE_API_KEY) {
      this.acceslibreHeaders = this.acceslibreHeaders.set(
        'Authorization',
        `Api-Key ${environment.ACCES_LIBRE_API_KEY}`,
      );
    } else {
      console.error(
        'The acceslibre api key is not defined in the environment file, please add it to have a working application',
      );
    }
  }

  public get_buildings_pagined_by_bounds(
    pageSize: number,
    bounds: MAP.BoxLatLng,
  ): Observable<API_ACCESS_LIBRE.FeatureCollectionResponse> {
    return this.get<API_ACCESS_LIBRE.FeatureCollectionResponse>(
      `https://acceslibre.beta.gouv.fr/api/erps/?page_size=${pageSize}&clean=true&zone=${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`,
    );
  }

  public get_buildings_pagined_by_postal_code(
    pageSize: number,
    postalCode: number,
  ): Observable<API_ACCESS_LIBRE.FeatureCollectionResponse> {
    return this.get<API_ACCESS_LIBRE.FeatureCollectionResponse>(
      `https://acceslibre.beta.gouv.fr/api/erps/?page_size=${pageSize}&clean=true&code_postal=${postalCode}`,
    );
  }

  public get_buildings_next_page(
    url: string,
  ): Observable<API_ACCESS_LIBRE.FeatureCollectionResponse> {
    return this.get<API_ACCESS_LIBRE.FeatureCollectionResponse>(url);
  }

  /**
   * Get the detail information of a building
   * @param buildingSlug the slug of the building, i don't know why accesslibre used slug insted of uuid
   * @returns the equipment in the building
   */
  public get_building_info(
    buildingSlug: string,
  ): Observable<API_ACCESS_LIBRE.BuildingDetails> {
    return this.get<API_ACCESS_LIBRE.BuildingDetails>(
      `https://acceslibre.beta.gouv.fr/api/erps/${buildingSlug}/widget`,
    );
  }

  private get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url, {
      headers: this.acceslibreHeaders,
    });
  }
}
