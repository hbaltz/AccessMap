import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MAP } from '../../models/map.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private boundsSelected: Subject<MAP.BoxLatLng> = new Subject<MAP.BoxLatLng>();

  public getBoundsSelected(): Subject<MAP.BoxLatLng> {
    return this.boundsSelected;
  }

  public setBoundsSelected(bounds: MAP.BoxLatLng): void {
    this.boundsSelected.next(bounds);
  }
}
