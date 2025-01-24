import { API_ACCESS_LIBRE } from '../../display-data/models/api-access-libre.model';

export const MOCK_BUILDING_FEATURE_COLLECTION: API_ACCESS_LIBRE.FeatureCollectionResponse =
  {
    type: 'FeatureCollection',
    count: 2,
    next: 'https://test.com/',
    previous: null,
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [5.384739, 49.163546] },
        properties: {
          uuid: '1',
          nom: 'hotel',
          adresse: '12 Rue Test 11111 TestCity',
          activite: { nom: 'Hôtel', vector_icon: 'hotel' },
          web_url: 'https://test.com/hotel/',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [6.900571, 48.275392] },
        properties: {
          uuid: '2',
          nom: 'Restaurant',
          adresse: '189 Rue Mock 22222 MockCity',
          activite: { nom: 'Restaurant', vector_icon: 'restaurant' },
          web_url: 'https://test.com/restaurant',
        },
      },
    ],
  };
