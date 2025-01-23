import { TestBed } from '@angular/core/testing';

import { BuildingSelectionService } from './building-selection.service';
import { Signal } from '@angular/core';

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

  describe('setSelectedBuildingId', () => {
    it('should set the selected building id', () => {
      const selectedBuildingId: Signal<string | null> =
        service.getSelectedBuildingId();

      service.setSelectedBuildingId('1');

      expect(selectedBuildingId()).toEqual('1');
    });
  });

  describe('clearSelectedBuildingId', () => {
    it('should clear the selected building id', () => {
      const selectedBuildingId: Signal<string | null> =
        service.getSelectedBuildingId();

      service.setSelectedBuildingId('1');
      service.clearSelectedBuildingId();

      expect(selectedBuildingId()).toBeNull();
    });
  });
});
