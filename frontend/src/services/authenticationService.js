import axios from 'axios';

// This file contains the AuthService class which handles authentication-related operations
// like login, logout, registration, and fetching the current user.
const apiURL = 'http://localhost:8081/api/auth/';

class AuthenticationService {
  login(email, password) {
    return axios.post(apiURL + 'signin', {
      email,
      password
    })
    .then(response => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    })
    .catch(error => {console.log("Error happened during login: " + error)});
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(name, email, password) {
    return axios.post(apiURL + 'signup', {
      name,
      email,
      password
    })
    .catch(error => {console.log("Error happened during register: " + error)});
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthenticationService();