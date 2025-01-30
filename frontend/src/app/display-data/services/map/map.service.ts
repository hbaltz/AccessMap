import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MAP } from '../../models/map.model';

// Defaul box on France
const DEFAULT_BOUNDS: MAP.BoxLatLng = {
  minLat: 39,
  minLng: -13,
  maxLat: 53,
  maxLng: 17,
};

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private boundsSelected: BehaviorSubject<MAP.BoxLatLng> =
    new BehaviorSubject<MAP.BoxLatLng>(DEFAULT_BOUNDS);

  public getBoundsSelected(): Subject<MAP.BoxLatLng> {
    return this.boundsSelected;
  }

  public setBoundsSelected(bounds: MAP.BoxLatLng): void {
    this.boundsSelected.next(bounds);
  }
}
