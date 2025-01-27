import { API_ACCESS_LIBRE } from '../../display-data/models/api-access-libre.model';

export const MOCK_BUILDING_DETAILS: API_ACCESS_LIBRE.BuildingDetails = {
  slug: 'the-test-ski-company-chalet-test',
  created_at: '2025-01-24T14:42:29.184227+01:00',
  updated_at: '2025-01-24T14:46:50.637323+01:00',
  sections: [
    {
      title: 'stationnement',
      labels: ['Pas de stationnement adapté à proximité'],
      icon: 'https://test.fr/static/img/car.png',
    },
    {
      title: 'accès',
      labels: ['Entrée de plain pied'],
      icon: 'https:/test.fr/static/img/path.png',
    },
    {
      title: 'personnel',
      labels: ['Personnel non formé'],
      icon: 'https:/test.fr/static/img/people.png',
    },
    {
      title: 'Inconnu',
      labels: ['Test'],
      icon: 'https://test.fr/static/img/wc.png',
    },
  ],
};
