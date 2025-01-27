import { Position } from 'geojson';

export namespace MAP {
  export interface Building {
    id: string;
    name: string;
    icon: string;
    activite: string;
    adress: string;
    gps_coord: Position;
  }

  export interface BoxLatLng {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  }
}
