import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuildingLoadingService } from './building-loading.service';

describe('BuildingLoadingService', () => {
  let service: BuildingLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingLoadingService);
  });

  describe('getIsBuildingDataLoading', () => {
    it('should return fasle by default', () => {
      const isBuildingDataLoading: Signal<boolean> =
        service.getIsBuildingDataLoading();
      expect(isBuildingDataLoading()).toBeFalse();
    });
  });

  describe('hasStartLoadingBuildingData', () => {
    it('should return set the value of isBuildingDataLoading to true', () => {
      const isBuildingDataLoading: Signal<boolean> =
        service.getIsBuildingDataLoading();
      service.hasStartLoadingBuildingData();
      expect(isBuildingDataLoading()).toBeTrue();
    });
  });

  describe('hasStopLoadingBuildingData', () => {
    it('should return set the value of isBuildingDataLoading to false', () => {
      const isBuildingDataLoading: Signal<boolean> =
        service.getIsBuildingDataLoading();
      service.hasStartLoadingBuildingData();
      service.hasStopLoadingBuildingData();
      expect(isBuildingDataLoading()).toBeFalse();
    });
  });
});
