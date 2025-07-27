import axios from 'axios';

// This file contains the AuthService class which handles authentication-related operations
// like login, logout, registration, and fetching the current user.
const apiURL = `${process.env.REACT_APP_API_URL}/api/auth/`;

class AuthenticationService {
  login(email, password, otpCode) {
    return axios.post(apiURL + 'login', {
      email,
      password,
      otpCode
    })
    .then(response => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    })
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }

  register(name, email, password) {
    return axios.post(apiURL + 'signup', {
      name,
      email,
      password
    })
    // .catch(error => {console.log("Error happened during register: " + error)});
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  saveUserToken = (input) => {
    const existingUser = JSON.parse(localStorage.getItem("user")) || {};

    if (typeof input === "string") {
        // Case 1: update only the token
        const updatedUser = { ...existingUser, token: input };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
    } else if (typeof input === "object" && input !== null && input.token) {
        // Case 2: merge the new object with existing user info
        const updatedUser = { ...existingUser, ...input };
        localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
        console.warn("saveUserToken error:", input);
    }
  };


  getUserToken() {
    const user = this.getCurrentUser();
    return user?.token || null;
  }
}

const authService = new AuthenticationService();
export default authService;
