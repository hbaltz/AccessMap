import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BuildingService } from './building.service';
import {
  AccesLibreFeatureCollectionResponse,
  ApiGeolocationService,
} from '../api/api-geolocation.service';
import { of } from 'rxjs';
import { DATA } from '../../models/map.model';

const MOCCK_BUILDING_FEATURE_COLLECTION: AccesLibreFeatureCollectionResponse = {
  type: 'FeatureCollection',
  count: 537012,
  next: null,
  previous: null,
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [5.384739, 49.163546] },
      properties: {
        uuid: '1',
        nom: 'Hotel',
        adresse: '12 Rue Test 11111 TestCity',
        activite: { nom: 'Hôtel', vector_icon: 'hotel' },
        web_url: 'https://test.com/hotel',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [6.900571, 48.275392] },
      properties: {
        uuid: '2',
        nom: 'Restaurant',
        adresse: '189 Rue Mock 22222 MockCity',
        activite: { nom: 'Restaurant', vector_icon: 'restaurant' },
        web_url: 'https://test.com/restaurant',
      },
    },
  ],
};

describe('BuildingService', () => {
  let service: BuildingService;
  const mockApiGeolocationService = jasmine.createSpyObj(
    'ApiGeolocationService',
    ['get_buildings_pagined']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiGeolocationService, useValue: mockApiGeolocationService },
      ],
    });
    service = TestBed.inject(BuildingService);
  });

  describe('getBuildings', () => {
    it('should call get_buildings_pagined and format the data to MAP.Building interface', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of(MOCCK_BUILDING_FEATURE_COLLECTION)
      );
      let resBuildingArray: DATA.Buidling[] = [];
      service.getBuildings().subscribe((buildingsArray) => {
        resBuildingArray = buildingsArray;
      });
      tick();

      const expectedResult: DATA.Buidling[] = [
        {
          id: '1',
          name: 'Hotel',
          gps_coord: [5.384739, 49.163546],
          icon: 'bed',
          activite: 'Hôtel',
        },
        {
          id: '2',
          name: 'Restaurant',
          gps_coord: [6.900571, 48.275392],
          icon: 'utensils',
          activite: 'Restaurant',
        },
      ];

      expect(
        mockApiGeolocationService.get_buildings_pagined
      ).toHaveBeenCalled();
      expect(resBuildingArray).toEqual(expectedResult);
    }));

    it('should call return an empty array if the features is null in the api response', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of({ ...MOCCK_BUILDING_FEATURE_COLLECTION, features: null })
      );
      let resBuildingArray: DATA.Buidling[] = [];
      service.getBuildings().subscribe((buildingsArray) => {
        resBuildingArray = buildingsArray;
      });
      tick();

      const expectedResult: DATA.Buidling[] = [];

      expect(
        mockApiGeolocationService.get_buildings_pagined
      ).toHaveBeenCalled();
      expect(resBuildingArray).toEqual(expectedResult);
    }));
  });
});
