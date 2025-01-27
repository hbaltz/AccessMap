import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BuildingFilterService } from './building-filter.service';
import { Observable } from 'rxjs';

describe('BuildingFilterService', () => {
  let service: BuildingFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingFilterService);
  });

  describe('getPostalCodeFilter', () => {
    it('should return an empty string by default', fakeAsync(() => {
      const postalCodeFilter: Observable<number | null> =
        service.getPostalCodeFilter();
      let result: number | null = null;
      postalCodeFilter.subscribe((postalCode) => {
        result = postalCode;
      });
      tick();

      expect(result).toBeNull();
    }));
  });

  describe('updatePostalCodeFilter', () => {
    it('should update the postal code to 69009', fakeAsync(() => {
      const postalCodeFilter: Observable<number | null> =
        service.getPostalCodeFilter();
      let result: number | null = null!;
      postalCodeFilter.subscribe((postalCode) => {
        result = postalCode;
      });

      service.updatePostalCodeFilter(69009);
      tick();

      expect(result).toEqual(69009);
    }));

    it('should not update the postal code if the postal code is not 5 digits', fakeAsync(() => {
      const postalCodeFilter: Observable<number | null> =
        service.getPostalCodeFilter();
      let result: number | null = null;
      postalCodeFilter.subscribe((postalCode) => {
        result = postalCode;
      });

      service.updatePostalCodeFilter(71);
      tick();

      expect(result).toBeNull();
    }));
  });

  describe('clearPostalCodeFilter', () => {
    it('should set the value to null', fakeAsync(() => {
      const postalCodeFilter: Observable<number | null> =
        service.getPostalCodeFilter();
      let result: number | null = null;
      postalCodeFilter.subscribe((postalCode) => {
        result = postalCode;
      });

      service.updatePostalCodeFilter(69009);
      service.clearPostalCodeFilter();
      tick();

      expect(result).toBeNull();
    }));
  });
});
