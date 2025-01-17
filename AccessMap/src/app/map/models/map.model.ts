import { Position } from 'geojson';

export namespace MAP {
  export interface Buidling {
    id: string;
    name: string | undefined;
    gps_coord: Position;
  }
}
