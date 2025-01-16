<template>
  <div class="upload-container">
    <h2 class="upload-heading">Upload Geospatial Data (GeoJSON, KML, TIFF)</h2>
    <div class="file-input-wrapper">
      <input type="file" @change="handleFileUpload" accept=".geojson,.json,.kml,.tiff,.tif"/>
      <button class="upload-button">Choose File</button>
    </div>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      errorMessage: '',
    };
  },
  mounted() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.$router.push('/login'); // Redirect to login if no token is found
    }
  },
 methods: {
  async handleFileUpload(event) {
    const token = localStorage.getItem('authToken');

    if (!token) {
      this.errorMessage = 'No token found. Please log in.';
      return;
    }

    const file = event.target.files[0]; // Get the selected file

    if (!file) {
      this.errorMessage = 'No file selected';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const extension = file.name.split('.').pop().toLowerCase();
    let fileType;

    if (extension === 'geojson' || extension === 'json') {
      fileType = 'GeoJSON';
    } else if (extension === 'kml') {
      fileType = 'KML';
    } else if (extension === 'tiff' || extension === 'tif') {
      fileType = 'TIFF';
    } else {
      this.errorMessage = 'Unsupported file type. Please upload GeoJSON, KML, or TIFF files.';
      return;
    }

    formData.append('fileType', fileType);

    try {
      const response = await axios.post('https://geo-be.onrender.com/api/files/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      this.errorMessage = `File uploaded successfully: ${response.data.fileUrl}`;
      this.$emit('file-uploaded', response.data.fileUrl);
    } catch (error) {
      console.log('Upload error:', error); // Log the full error response for debugging
      this.errorMessage = error.response?.data?.error || 'Error uploading file';
    }
  },
},

};
</script>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.upload-heading {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.file-input-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.upload-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ff4d4d;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>
