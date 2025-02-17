import { Position } from 'geojson';

export namespace DATA {
  export interface Building {
    id: string;
    name: string;
    icon: string;
    activite: string;
    address: string;
    gps_coord: Position;
  }

  export interface BuildingAccessibility {
    label: string;
    icon: string;
    accessibilityInformation: string[];
  }
}
