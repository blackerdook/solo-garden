import axios from 'axios';

const BASE_URL = 'https://openfarm.cc/api/v1';

export const fetchPlants = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/crops?filter=${query}`);
  
    console.log('API raw response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
};
