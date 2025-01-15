<template> 
  <div class="auth-container">
    <h1 class="app-heading">GeoSpatial Data Application</h1>

    <div class="auth-box">
      <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="user.email"
          type="email"
          placeholder="Email"
          required
          class="input-field"
        />
        <input
          v-model="user.password"
          type="password"
          placeholder="Password"
          required
          class="input-field"
        />
        <!-- Show a username input only during registration -->
        <input
          v-if="!isLogin"
          v-model="user.username"
          type="text"
          placeholder="Username"
          required
          class="input-field"
        />
        <button type="submit" class="submit-btn">
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
        <p class="toggle-auth" @click="toggleAuth">
          {{ isLogin ? 'Create an account' : 'Already have an account?' }}
        </p>
      </form>

      <!-- Show success message if registration succeeds -->
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <!-- Show error message if authentication fails -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import L from 'leaflet';
import omnivore from '@mapbox/leaflet-omnivore';


export default {
  data() {
    return {
      user: { username: '', email: '', password: '' },
      isLogin: true,
      errorMessage: '', // Store error message to display
      successMessage: '', // Store success message to display
    };
  },
  methods: {
    toggleAuth() {
      this.isLogin = !this.isLogin;
      this.errorMessage = ''; // Clear error message when toggling
      this.successMessage = ''; // Clear success message when toggling
    },

    async handleSubmit() {
  try {
    const url = this.isLogin
      ? 'https://geo-be.onrender.com/api/users/login'
      : 'https://geo-be.onrender.com/api/users/register';
    const response = await axios.post(url, this.user);
    console.log('User authenticated:', response.data);

    // Clear any existing error message after successful registration or login
    this.errorMessage = ''; 
    
    if (!this.isLogin) {
      // Show success message after successful registration
      this.successMessage = 'User registered successfully. You can now log in.';
    } else {
      // Save token to localStorage and redirect to upload page
      localStorage.setItem('authToken', response.data.token);
      console.log(localStorage.getItem('token'));
      this.$router.push('/upload'); // Redirect to upload page after login

      // Optionally, trigger a route reload to force the application state to update
      this.$router.go(0); // Reloads the app after pushing the new route
    }
  } catch (error) {
    console.error('Error authenticating:', error);
    if (error.response) {
      console.error('Error response:', error.response.data); // Log error response
      this.errorMessage = error.response.data.error || 'An error occurred';
    } else {
      this.errorMessage = 'Network or server error';
    }

    // Clear success message on error
    this.successMessage = '';
  }
}

    
  },
};
</script>

<style scoped>

.app-heading {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4A90E2;
  margin-bottom: 20px;
  text-align: center;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; /* Aligning elements vertically */
  height: 100vh;
  background-color: #f4f7fc;
  font-family: 'Arial', sans-serif;
}

.auth-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.toggle-auth {
  margin-top: 15px;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
}

.toggle-auth:hover {
  text-decoration: underline;
}

.error-message {
  margin-top: 10px;
  color: red;
  font-size: 14px;
}

.success-message {
  margin-top: 10px;
  color: green;
  font-size: 14px;
}

/* Responsive Styles */
@media (max-width: 600px) {
  .auth-box {
    padding: 20px;
    width: 90%;
  }

  h2 {
    font-size: 20px;
  }

  .input-field {
    font-size: 14px;
  }

  .submit-btn {
    font-size: 14px;
  }

  .toggle-auth {
    font-size: 12px;
  }
}
</style>