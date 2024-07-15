import axios from 'axios';

const API_URL = 'your_api_base_url';

export const userAPI = {
  getUsers: async (id = null) => {
    try {
      const response = await axios.get(`${API_URL}/users${id ? `/${id}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'your_auth_token_here'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
          'Authorization': 'your_auth_token_here'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};