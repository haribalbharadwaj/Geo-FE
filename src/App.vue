<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserAuth from './components/UserAuth.vue';
import FileUpload from './components/FileUpload.vue';
import Leaflet from './components/Leaflet.vue';

// Reactive variables
const isLoggedIn = ref(false);
const showLogin = ref(true);  
const uploadedFiles = ref([]);

// Get the router instance
const router = useRouter();

// Create a reference to the Leaflet component
const leafletComponent = ref(null);

// Check login status when the component is mounted
onMounted(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    isLoggedIn.value = true;
    showLogin.value = false;
  }
});

// Login success handler
const onLoginSuccess = () => {
  isLoggedIn.value = true;
  showLogin.value = false; 
  localStorage.setItem('authToken', 'your_token_here');
  router.push('/upload');
};

// Logout handler
const onLogout = () => {
  isLoggedIn.value = false;
  showLogin.value = true;
  localStorage.removeItem('authToken');
  router.push('/login');
};

// Register success handler
const onRegisterSuccess = () => {
  showLogin.value = true;
};

// File upload success handler
const handleFileUploaded = (fileUrl) => {
  uploadedFiles.value.push(fileUrl); 
};

// Method to call Leaflet's fetchSavedMaps function
const onFileUploaded = () => {
  // Check if leafletComponent ref is available, then call the fetchSavedMaps function
  if (leafletComponent.value) {
    leafletComponent.value.fetchSavedMaps();  // This will now call the function from Leaflet component
  }
};
</script>

<template>
  <div class="app-container">
    <!-- Show login page if user is not logged in -->
    <section v-if="showLogin" class="auth-section">
      <UserAuth @loginSuccess="onLoginSuccess" />
    </section>

    <!-- Show File Upload Section if logged in -->
    <section v-if="isLoggedIn" class="upload-section">
      <h2>Geospatial Data Application</h2>
      <FileUpload @fileUploaded="onFileUploaded" />
      <button @click="onLogout">Logout</button>
    </section>

    <!-- Map Rendering Section -->
    <section v-if="isLoggedIn" class="map-section">
      <h2>Geospatial Map</h2>
      <Leaflet ref="leafletComponent" />
    </section>
  </div>
</template>

<style scoped>
/* General body styling */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f7fc;
  color: #333;
}

/* Overall app container */
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Header Section */
h1 {
  font-size: 2.5rem;
  color: #4A90E2;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 700;
}

/* Subheading styling */
h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

/* Styling for the sections (Login, Upload, Map) */
.auth-section, .upload-section, .map-section {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fafbfc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin: 10px 0;
}

.auth-section {
  background-color: #f9f9f9;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 30px;
}

/* Button styling */
button {
  background-color: #4A90E2;
  color: white;
  font-size: 1rem;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

button:hover {
  background-color: #357ab7;
}

/* File upload styling */
.upload-section input[type="file"] {
  display: block;
  margin: 10px 0;
  font-size: 1rem;
  padding: 10px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
}

/* Leaflet map section */
.map-section {
  margin-top: 20px;
  border-radius: 10px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
}

/* Centered layout for Leaflet map */
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
}

@media (max-width: 768px) {
  /* Mobile responsiveness */
  .app-container {
    padding: 15px;
  }

  .auth-section, .upload-section, .map-section {
    width: 100%;
    margin: 10px 0;
  }
}
</style>
