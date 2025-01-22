import { TestBed } from '@angular/core/testing';

import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [GeolocationService] });
    service = TestBed.inject(GeolocationService);
  });

  describe('getCurrentLocation', () => {
    it('should return a the current user location', async () => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (successCallback) => {
          const coords: Partial<GeolocationCoordinates> = {
            latitude: 40.7128,
            longitude: 42.7138,
          };

          //@ts-ignore
          const position: GeolocationPosition = {
            coords: coords as GeolocationCoordinates,
            timestamp: Date.now(),
          };

          successCallback(position);
        },
      );

      const position = await service.getCurrentLocation();
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
      expect(position.coords.latitude).toEqual(40.7128);
      expect(position.coords.longitude).toEqual(42.7138);
    });

    it('should handle an error when location is not available', async () => {
      const mockGeolocationPostiionError = {
        code: 1,
        message: 'User denied Geolocation',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
      };

      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (_successCallback, errorCallback) => {
          if (errorCallback) {
            errorCallback(
              mockGeolocationPostiionError as GeolocationPositionError,
            );
          }
        },
      );

      try {
        await service.getCurrentLocation();
      } catch (error) {
        expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
        expect(error).toEqual(mockGeolocationPostiionError);
      }
    });
  });

  it('should reject when geolocation is not supported by the browser', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    try {
      await service.getCurrentLocation();
      fail('The promise should have been rejected');
    } catch (error) {
      expect(error).toBe('Geolocation is not supported by your browser');
    }
  });
});
