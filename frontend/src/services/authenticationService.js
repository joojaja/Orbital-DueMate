import axios from 'axios';

// This file contains the AuthService class which handles authentication-related operations
// like login, logout, registration, and fetching the current user.
const API_URL = 'http://localhost:8081/api/auth/';

class AuthenticationService {
  login(email, password) {
    return axios
      .post(API_URL + 'signin', {
        email,
        password
      }).then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(name, email, password) {
    return axios.post(API_URL + 'signup', {
      name,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthenticationService();