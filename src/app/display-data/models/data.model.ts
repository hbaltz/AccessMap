import { Position } from 'geojson';
import { API_ACCESS_LIBRE } from './api-access-libre.model';

export namespace DATA {
  export interface Building {
    id: string;
    name: string;
    icon: string;
    activite: string;
    adress: string;
    gps_coord: Position;
    slug: string; // Used in the accesslibre to get details of the building, I don't know why they don't use the uniq id.
  }

  export interface BuildingDetailsSection
    extends API_ACCESS_LIBRE.BuildingDetailsSection {
    icon: string; // Icon name
  }
}
