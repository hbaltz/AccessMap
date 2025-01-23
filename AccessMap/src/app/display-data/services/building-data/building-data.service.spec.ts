import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BuildingDataService } from './building-data.service';
import {
  AccesLibreFeatureCollectionResponse,
  ApiGeolocationService,
} from '../api/api-geolocation.service';
import { of } from 'rxjs';
import { DATA } from '../../models/data.model';
import { MapService } from '../map/map.service';
import { asyncData } from '../../../test-utils/async-data';
import { MAP } from '../../models/map.model';
import { Signal } from '@angular/core';

const MOCK_BUILDING_FEATURE_COLLECTION: AccesLibreFeatureCollectionResponse = {
  type: 'FeatureCollection',
  count: 2,
  next: 'https://test.com/',
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

const MOCK_MAP_BOUNDS: MAP.BoxLatLng = {
  minLat: 0,
  minLng: 1,
  maxLat: 2,
  maxLng: 3,
};

describe('BuildingDataService', () => {
  let service: BuildingDataService;

  const mockApiGeolocationService: jasmine.SpyObj<ApiGeolocationService> =
    jasmine.createSpyObj<ApiGeolocationService>('ApiGeolocationService', [
      'get_buildings_pagined',
      'get_buildings_next_page',
    ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiGeolocationService, useValue: mockApiGeolocationService },
        {
          provide: MapService,
          useValue: {
            getBoundsSelected: () => asyncData<MAP.BoxLatLng>(MOCK_MAP_BOUNDS),
          },
        },
      ],
    });

    service = TestBed.inject(BuildingDataService);
  });

  describe('getBuildings', () => {
    it('should call get_buildings_pagined and format the data to MAP.Building interface', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_FEATURE_COLLECTION),
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
          adress: '12 Rue Test 11111 TestCity',
        },
        {
          id: '2',
          name: 'Restaurant',
          gps_coord: [6.900571, 48.275392],
          icon: 'utensils',
          activite: 'Restaurant',
          adress: '189 Rue Mock 22222 MockCity',
        },
      ];

      expect(
        mockApiGeolocationService.get_buildings_pagined,
      ).toHaveBeenCalledWith(100, MOCK_MAP_BOUNDS);
      expect(resBuildingArray).toEqual(expectedResult);
    }));

    it('should call use the default value for icon if the activite is no know', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of({
          ...MOCK_BUILDING_FEATURE_COLLECTION,
          features: [
            {
              ...MOCK_BUILDING_FEATURE_COLLECTION.features[0],
              properties: {
                ...MOCK_BUILDING_FEATURE_COLLECTION.features[0].properties,
                activite: { vector_icon: 'unknown' },
              },
            },
          ],
        }),
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
          icon: 'question',
          activite: 'Activité inconnue',
          adress: '12 Rue Test 11111 TestCity',
        },
      ];

      expect(
        mockApiGeolocationService.get_buildings_pagined,
      ).toHaveBeenCalledWith(100, MOCK_MAP_BOUNDS);
      expect(resBuildingArray).toEqual(expectedResult);
    }));

    it('should call return an empty array if the features is an empty array in the api response', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of({ ...MOCK_BUILDING_FEATURE_COLLECTION, features: [] }),
      );
      let resBuildingArray: DATA.Buidling[] = [];
      service.getBuildings().subscribe((buildingsArray) => {
        resBuildingArray = buildingsArray;
      });
      tick();

      const expectedResult: DATA.Buidling[] = [];

      expect(
        mockApiGeolocationService.get_buildings_pagined,
      ).toHaveBeenCalledWith(100, MOCK_MAP_BOUNDS);
      expect(resBuildingArray).toEqual(expectedResult);
    }));
  });

  describe('getnumberOfBuildings', () => {
    it('should return the number of available buildings', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_FEATURE_COLLECTION),
      );
      service.getBuildings().subscribe();
      tick();
      const numberOfBuildginsSignal: Signal<number> =
        service.getnumberOfBuildings();
      const resNumberOfBuildings: number = numberOfBuildginsSignal();

      const expectedResult: number = 2;

      expect(
        mockApiGeolocationService.get_buildings_pagined,
      ).toHaveBeenCalled();
      expect(resNumberOfBuildings).toEqual(expectedResult);
    }));
  });

  describe('getNumberOfDsiplayedBuildings', () => {
    it('should return the number of displayed buildings', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_FEATURE_COLLECTION),
      );
      service.getBuildings().subscribe();
      tick();
      const numberOfBuildginsSignal: Signal<number> =
        service.getNumberOfDsiplayedBuildings();
      const resNumberOfBuildings: number = numberOfBuildginsSignal();

      const expectedResult: number = 2;

      expect(
        mockApiGeolocationService.get_buildings_pagined,
      ).toHaveBeenCalled();
      expect(resNumberOfBuildings).toEqual(expectedResult);
    }));
  });

  describe('hasNextPage', () => {
    it('should return true if the nextBuildingUrl is not null', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_FEATURE_COLLECTION),
      );
      service.getBuildings().subscribe();
      tick();
      const hasNextPageSignal: Signal<boolean> = service.hasNextPage();
      const resHasNextPage: boolean = hasNextPageSignal();

      expect(
        mockApiGeolocationService.get_buildings_pagined,
      ).toHaveBeenCalled();
      expect(resHasNextPage).toBeTrue();
    }));

    it('should return false if the nextBuildingUrl is null', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of({ ...MOCK_BUILDING_FEATURE_COLLECTION, next: null }),
      );
      service.getBuildings().subscribe();
      tick();
      const hasNextPageSignal: Signal<boolean> = service.hasNextPage();
      const resHasNextPage: boolean = hasNextPageSignal();

      expect(
        mockApiGeolocationService.get_buildings_pagined,
      ).toHaveBeenCalled();
      expect(resHasNextPage).toBeFalse();
    }));
  });

  describe('loadNextBuildingsPage', () => {
    beforeEach(() => {
      mockApiGeolocationService.get_buildings_next_page.and.returnValue(
        of(MOCK_BUILDING_FEATURE_COLLECTION),
      );
    });

    it('should call get_buildings_next_page and format the data to MAP.Building interface', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_FEATURE_COLLECTION),
      );
      mockApiGeolocationService.get_buildings_next_page.and.returnValue(
        of(MOCK_BUILDING_FEATURE_COLLECTION),
      );
      service.getBuildings().subscribe();
      tick();
      let resBuildingArray: DATA.Buidling[] = [];
      service.loadNextBuildingsPage().subscribe((buildingsArray) => {
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
          adress: '12 Rue Test 11111 TestCity',
        },
        {
          id: '2',
          name: 'Restaurant',
          gps_coord: [6.900571, 48.275392],
          icon: 'utensils',
          activite: 'Restaurant',
          adress: '189 Rue Mock 22222 MockCity',
        },
      ];

      expect(
        mockApiGeolocationService.get_buildings_next_page,
      ).toHaveBeenCalledWith('https://test.com/');
      expect(resBuildingArray).toEqual(expectedResult);
    }));

    it('should throw an error if the nextBuildingUrl is null', fakeAsync(() => {
      mockApiGeolocationService.get_buildings_pagined.and.returnValue(
        of({ ...MOCK_BUILDING_FEATURE_COLLECTION, next: null }),
      );
      service.getBuildings().subscribe();
      tick();

      let errorMessage: string = '';
      service.loadNextBuildingsPage().subscribe({
        next: () => {
          fail('Expected an error, but got data instead');
        },
        error: (err) => {
          errorMessage = err.message;
        },
      });
      tick();

      const expectedResult: string = 'No more buildings to load';

      expect(errorMessage).toEqual(expectedResult);
    }));
  });
});
