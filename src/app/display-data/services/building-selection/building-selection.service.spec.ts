import { TestBed } from '@angular/core/testing';

import { BuildingSelectionService } from './building-selection.service';
import { Signal } from '@angular/core';
import { DATA } from '../../models/data.model';

const MOCK_BUILDING: DATA.Building = {
  id: '1',
  name: 'Hotel',
  gps_coord: [5.384739, 49.163546],
  icon: 'bed',
  activite: 'Hôtel',
  adress: '12 Rue Test 11111 TestCity',
  slug: 'hotel',
};

describe('BuildingSelectionService', () => {
  let service: BuildingSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingSelectionService);
  });

  describe('getSelectedBuildingId', () => {
    it('should return null if no building are selected', () => {
      const selectedBuildingId: Signal<string | null> =
        service.getSelectedBuildingId();
      expect(selectedBuildingId()).toBeNull();
    });
  });

  describe('getSelectedBuildingSlug', () => {
    it('should return null if no building are selected', () => {
      const selectedBuilding: Signal<DATA.Building | null> =
        service.getSelectedBuilding();
      expect(selectedBuilding()).toBeNull();
    });
  });

  describe('setSelectedBuildingId', () => {
    it('should set the selected building id', () => {
      const selectedBuildingId: Signal<string | null> =
        service.getSelectedBuildingId();
      const selectedBuilding: Signal<DATA.Building | null> =
        service.getSelectedBuilding();

      service.setSelectedBuilding(MOCK_BUILDING);

      expect(selectedBuildingId()).toEqual('1');
      expect(selectedBuilding()).toEqual(MOCK_BUILDING);
    });
  });

  describe('clearSelectedBuildingId', () => {
    it('should clear the selected building id', () => {
      const selectedBuildingId: Signal<string | null> =
        service.getSelectedBuildingId();
      const selectedBuilding: Signal<DATA.Building | null> =
        service.getSelectedBuilding();

      service.setSelectedBuilding(MOCK_BUILDING);
      service.clearSelectedBuilding();

      expect(selectedBuildingId()).toBeNull();
      expect(selectedBuilding()).toBeNull();
    });
  });
});
