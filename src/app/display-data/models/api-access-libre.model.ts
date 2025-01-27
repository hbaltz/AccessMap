import { FeatureCollection, Point } from 'geojson';

export namespace API_ACCESS_LIBRE {
  export interface FeatureCollectionResponse extends FeatureCollection<Point> {
    count: number;
    next: string | null;
    previous: string | null;
  }

  export interface BuildingDetailsSection {
    title: string;
    labels: string[];
    icon: string; // URL
  }

  export interface BuildingDetails {
    slug: string;
    created_at: string; // Could be convert to Date
    updated_at: string; // Could be convert to Date
    sections: BuildingDetailsSection[];
  }
}
