import { API_DATA } from '../../display-data/models/api-data.model';

export const MOCK_BUILDING_LIST_RESPONSE: API_DATA.BuildingListResponse = {
  count: 3,
  total_count: 18,
  total_pages: 6,
  current_page: 1,
  next: 'http://next.test',
  previous: 'http://previous.test',
  results: [
    {
      uuid: '00000000-0000-0000-0000-000000000001',
      name: 'Entreprise A',
      latitude: 49.190218,
      longitude: 6.672443,
      address: 'Rue Anonyme, Ville A',
      activity: {
        name: 'Bien-être',
        icon: 'heartbeat',
      },
    },
    {
      uuid: '00000000-0000-0000-0000-000000000002',
      name: 'Entreprise B',
      latitude: 49.181573,
      longitude: 6.650366,
      address: 'Rue Anonyme, Ville B',
      activity: {
        name: 'Fleuriste',
        icon: 'flower',
      },
    },
    {
      uuid: '00000000-0000-0000-0000-000000000003',
      name: 'Entreprise C',
      latitude: 49.170421,
      longitude: 6.62967,
      address: 'Rue Anonyme, Ville C',
      activity: {
        name: 'Chocolatier',
        icon: 'candy-cane',
      },
    },
  ],
};
