export namespace API_DATA {
  export interface BuildingListResponse {
    count: number;
    total_count: number;
    next: string | null;
    previous: string | null;
    total_pages: number;
    current_page: number;
    results: BuildingItem[];
  }

  export interface BuildingItem {
    uuid: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    activity: ActivityItem;
  }

  export interface ActivityItem {
    name: string;
    icon: string;
  }
}
