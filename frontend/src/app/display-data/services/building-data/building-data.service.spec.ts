import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BuildingData2Service } from './building-data.service';
import { MAP } from '../../models/map.model';

import { of } from 'rxjs';
import { DATA } from '../../models/data.model';
import { MapService } from '../map/map.service';
import { asyncData } from '../../../test-utils/async-data';
import { Signal } from '@angular/core';
import { BuildingLoadingService } from '../building-loading/building-loading.service';
import { BuildingFilterService } from '../building-filter/building-filter.service';
import { ApiBuildingService } from '../api/api-building.service';
import { MOCK_BUILDING_LIST_RESPONSE } from '../../../test-utils/mock/building-response.mock';

const MOCK_MAP_BOUNDS: MAP.BoxLatLng = {
  minLat: 0,
  minLng: 1,
  maxLat: 2,
  maxLng: 3,
};

describe('BuildingData2Service', () => {
  let service: BuildingData2Service;

  const mockApiBuildingService: jasmine.SpyObj<ApiBuildingService> =
    jasmine.createSpyObj<ApiBuildingService>('ApiBuildingService', [
      'get_buildings_pagined',
      'get_buildings_next_page',
    ]);

  const mockBuildingLoadingService: jasmine.SpyObj<BuildingLoadingService> =
    jasmine.createSpyObj<BuildingLoadingService>('BuildingLoadingService', [
      'hasStartLoadingBuildingData',
      'hasStopLoadingBuildingData',
    ]);

  const mockBuildingFilterService: jasmine.SpyObj<BuildingFilterService> =
    jasmine.createSpyObj<BuildingFilterService>('BuildingFilterService', [
      'getPostalCodeFilter',
    ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiBuildingService, useValue: mockApiBuildingService },
        {
          provide: BuildingLoadingService,
          useValue: mockBuildingLoadingService,
        },
        {
          provide: BuildingFilterService,
          useValue: mockBuildingFilterService,
        },
        {
          provide: MapService,
          useValue: {
            getBoundsSelected: () => asyncData<MAP.BoxLatLng>(MOCK_MAP_BOUNDS),
          },
        },
      ],
    });

    service = TestBed.inject(BuildingData2Service);
  });

  describe('getBuildings', () => {
    it('should call get_buildings_pagined and format the data to MAP.Building interface', fakeAsync(() => {
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(null));
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      let resBuildingArray: DATA.Building[] = null!;
      service.getBuildings().subscribe((buildingsArray) => {
        resBuildingArray = buildingsArray;
      });
      tick();

      const expectedResult: DATA.Building[] = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Entreprise A',
          icon: 'heartbeat',
          activite: 'Bien-être',
          address: 'Rue Anonyme, Ville A',
          gps_coord: [6.672443, 49.190218],
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          name: 'Entreprise B',
          icon: 'flower',
          activite: 'Fleuriste',
          address: 'Rue Anonyme, Ville B',
          gps_coord: [6.650366, 49.181573],
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          name: 'Entreprise C',
          icon: 'candy-cane',
          activite: 'Chocolatier',
          address: 'Rue Anonyme, Ville C',
          gps_coord: [6.62967, 49.170421],
        },
      ];

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalledWith(
        500,
        null,
        MOCK_MAP_BOUNDS,
      );
      expect(
        mockBuildingLoadingService.hasStartLoadingBuildingData,
      ).toHaveBeenCalled();
      expect(
        mockBuildingLoadingService.hasStopLoadingBuildingData,
      ).toHaveBeenCalled();
      expect(resBuildingArray).toEqual(expectedResult);
    }));

    it('should call get_buildings_pagined with the postal code', fakeAsync(() => {
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(69009));
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      let resBuildingArray: DATA.Building[] = null!;
      service.getBuildings().subscribe((buildingsArray) => {
        resBuildingArray = buildingsArray;
      });
      tick();

      const expectedResult: DATA.Building[] = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Entreprise A',
          icon: 'heartbeat',
          activite: 'Bien-être',
          address: 'Rue Anonyme, Ville A',
          gps_coord: [6.672443, 49.190218],
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          name: 'Entreprise B',
          icon: 'flower',
          activite: 'Fleuriste',
          address: 'Rue Anonyme, Ville B',
          gps_coord: [6.650366, 49.181573],
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          name: 'Entreprise C',
          icon: 'candy-cane',
          activite: 'Chocolatier',
          address: 'Rue Anonyme, Ville C',
          gps_coord: [6.62967, 49.170421],
        },
      ];

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalledWith(
        500,
        69009,
        MOCK_MAP_BOUNDS,
      );
      expect(
        mockBuildingLoadingService.hasStartLoadingBuildingData,
      ).toHaveBeenCalled();
      expect(
        mockBuildingLoadingService.hasStopLoadingBuildingData,
      ).toHaveBeenCalled();
      expect(resBuildingArray).toEqual(expectedResult);
    }));

    it('should retrun an empty array', fakeAsync(() => {
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(null));
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      let resBuildingArray: DATA.Building[] = null!;
      service.getBuildings().subscribe((buildingsArray) => {
        resBuildingArray = buildingsArray;
      });
      tick();

      const expectedResult: DATA.Building[] = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Entreprise A',
          icon: 'heartbeat',
          activite: 'Bien-être',
          address: 'Rue Anonyme, Ville A',
          gps_coord: [6.672443, 49.190218],
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          name: 'Entreprise B',
          icon: 'flower',
          activite: 'Fleuriste',
          address: 'Rue Anonyme, Ville B',
          gps_coord: [6.650366, 49.181573],
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          name: 'Entreprise C',
          icon: 'candy-cane',
          activite: 'Chocolatier',
          address: 'Rue Anonyme, Ville C',
          gps_coord: [6.62967, 49.170421],
        },
      ];

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalledWith(
        500,
        null,
        MOCK_MAP_BOUNDS,
      );
      expect(
        mockBuildingLoadingService.hasStartLoadingBuildingData,
      ).toHaveBeenCalled();
      expect(
        mockBuildingLoadingService.hasStopLoadingBuildingData,
      ).toHaveBeenCalled();
      expect(resBuildingArray).toEqual(expectedResult);
    }));

    it('should call return an empty array if tthe resultis an empty array in the api response', fakeAsync(() => {
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of({ ...MOCK_BUILDING_LIST_RESPONSE, results: [] }),
      );
      let resBuildingArray: DATA.Building[] = [];
      service.getBuildings().subscribe((buildingsArray) => {
        resBuildingArray = buildingsArray;
      });
      tick();

      const expectedResult: DATA.Building[] = [];

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalledWith(
        500,
        null,
        MOCK_MAP_BOUNDS,
      );
      expect(resBuildingArray).toEqual(expectedResult);
    }));
  });

  describe('getnumberOfBuildings', () => {
    it('should return the number of available buildings', fakeAsync(() => {
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(null));
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      service.getBuildings().subscribe();
      tick();
      const numberOfBuildginsSignal: Signal<number> =
        service.getnumberOfBuildings();
      const resNumberOfBuildings: number = numberOfBuildginsSignal();

      const expectedResult: number = 18;

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalled();
      expect(resNumberOfBuildings).toEqual(expectedResult);
    }));

    it('should return the number of available buildings with postal code filter', fakeAsync(() => {
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(69009));
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      service.getBuildings().subscribe();
      tick();
      const numberOfBuildginsSignal: Signal<number> =
        service.getnumberOfBuildings();
      const resNumberOfBuildings: number = numberOfBuildginsSignal();

      const expectedResult: number = 18;

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalled();
      expect(resNumberOfBuildings).toEqual(expectedResult);
    }));
  });

  describe('getNumberOfDsiplayedBuildings', () => {
    it('should return the number of displayed buildings', fakeAsync(() => {
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(null));
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      service.getBuildings().subscribe();
      tick();
      const numberOfBuildginsSignal: Signal<number> =
        service.getNumberOfDsiplayedBuildings();
      const resNumberOfBuildings: number = numberOfBuildginsSignal();

      const expectedResult: number = 3;

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalled();
      expect(resNumberOfBuildings).toEqual(expectedResult);
    }));

    it('should return the number of displayed buildings with postal code filter', fakeAsync(() => {
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(69009));
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      service.getBuildings().subscribe();
      tick();
      const numberOfBuildginsSignal: Signal<number> =
        service.getNumberOfDsiplayedBuildings();
      const resNumberOfBuildings: number = numberOfBuildginsSignal();

      const expectedResult: number = 3;

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalled();
      expect(resNumberOfBuildings).toEqual(expectedResult);
    }));
  });

  describe('hasNextPage', () => {
    beforeEach(() => {
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(null));
    });
    it('should return true if the nextBuildingUrl is not null', fakeAsync(() => {
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      service.getBuildings().subscribe();
      tick();
      const hasNextPageSignal: Signal<boolean> = service.hasNextPage();
      const resHasNextPage: boolean = hasNextPageSignal();

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalled();
      expect(resHasNextPage).toBeTrue();
    }));

    it('should return false if the nextBuildingUrl is null', fakeAsync(() => {
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of({ ...MOCK_BUILDING_LIST_RESPONSE, next: null }),
      );
      service.getBuildings().subscribe();
      tick();
      const hasNextPageSignal: Signal<boolean> = service.hasNextPage();
      const resHasNextPage: boolean = hasNextPageSignal();

      expect(mockApiBuildingService.get_buildings_pagined).toHaveBeenCalled();
      expect(resHasNextPage).toBeFalse();
    }));
  });

  describe('loadNextBuildingsPage', () => {
    beforeEach(() => {
      mockApiBuildingService.get_buildings_next_page.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      mockBuildingFilterService.getPostalCodeFilter.and.returnValue(of(null));
    });

    it('should call get_buildings_next_page and format the data to MAP.Building interface', fakeAsync(() => {
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of(MOCK_BUILDING_LIST_RESPONSE),
      );
      service.getBuildings().subscribe();
      tick();
      let resBuildingArray: DATA.Building[] = null!;
      service.loadNextBuildingsPage().subscribe((buildingsArray) => {
        resBuildingArray = buildingsArray;
      });
      tick();

      const expectedResult: DATA.Building[] = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Entreprise A',
          icon: 'heartbeat',
          activite: 'Bien-être',
          address: 'Rue Anonyme, Ville A',
          gps_coord: [6.672443, 49.190218],
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          name: 'Entreprise B',
          icon: 'flower',
          activite: 'Fleuriste',
          address: 'Rue Anonyme, Ville B',
          gps_coord: [6.650366, 49.181573],
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          name: 'Entreprise C',
          icon: 'candy-cane',
          activite: 'Chocolatier',
          address: 'Rue Anonyme, Ville C',
          gps_coord: [6.62967, 49.170421],
        },
      ];

      expect(
        mockApiBuildingService.get_buildings_next_page,
      ).toHaveBeenCalledWith('http://next.test');
      expect(resBuildingArray).toEqual(expectedResult);
    }));

    it('should throw an error if the nextBuildingUrl is null', fakeAsync(() => {
      mockApiBuildingService.get_buildings_pagined.and.returnValue(
        of({ ...MOCK_BUILDING_LIST_RESPONSE, next: null }),
      );
      service.getBuildings().subscribe();
      tick();

      let errorMessage: string = null!;
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
