import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FeatureCollection, Point } from 'geojson';
import { MAP } from '../../models/map.model';
export interface AccesLibreFeatureCollectionResponse
  extends FeatureCollection<Point> {
  count: number;
  next: string | null;
  previous: string | null;
}

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

  public get_buildings_pagined(
    pageSize: number,
    bounds: MAP.BoxLatLng,
  ): Observable<AccesLibreFeatureCollectionResponse> {
    return this.httpClient.get<AccesLibreFeatureCollectionResponse>(
      `https://acceslibre.beta.gouv.fr/api/erps/?page_size=${pageSize}&&?clean=true&&zone=${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`,
      {
        headers: this.acceslibreHeaders,
      },
    );
  }

  public get_buildings_next_page(
    url: string,
  ): Observable<AccesLibreFeatureCollectionResponse> {
    return this.httpClient.get<AccesLibreFeatureCollectionResponse>(url, {
      headers: this.acceslibreHeaders,
    });
  }
}
