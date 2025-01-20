import { Position } from 'geojson';

export namespace DATA {
  export interface Buidling {
    id: string;
    name: string;
    icon: string;
    activite: string;
    gps_coord: Position;
  }
}
