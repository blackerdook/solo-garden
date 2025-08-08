import axios from 'axios';

const API_KEY = 'sk-2V8M689425f03ad9e11730';
const BASE_URL = 'https://perenual.com/api';

export const fetchPlants = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/species-list`, {
      params: {
        key: API_KEY,
        q: query,
      },
    });

    console.log('Perenual response:', response.data);
    return response.data.data;  // array of plants
  } catch (error) {
    console.error('Perenual API error:', error);
    return [];
  }
};
