import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MapService } from './map.service';
import { Subject } from 'rxjs';
import { MAP } from '../../models/map.model';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapService);
  });

  describe('getBoundsSelected', () => {
    it('should return a Subject<MAP.BoxLatLng>', () => {
      expect(service.getBoundsSelected()).toBeInstanceOf(
        Subject<MAP.BoxLatLng>,
      );
    });
  });

  describe('setBoundsSelected', () => {
    it('should set the new bounds', fakeAsync(() => {
      let resBoundsSelected: MAP.BoxLatLng = {
        minLat: -1,
        minLng: -1,
        maxLat: -1,
        maxLng: -1,
      };
      service
        .getBoundsSelected()
        .subscribe((bounds) => (resBoundsSelected = bounds));
      service.setBoundsSelected({ minLat: 0, minLng: 0, maxLat: 1, maxLng: 1 });

      tick();

      const expectedResult: MAP.BoxLatLng = {
        minLat: 0,
        minLng: 0,
        maxLat: 1,
        maxLng: 1,
      };
      expect(resBoundsSelected).toEqual(expectedResult);
    }));
  });
});
