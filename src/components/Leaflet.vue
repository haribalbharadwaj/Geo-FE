<template>
  <div>
    <!-- Map Div -->
    <div id="map" style="height: 500px; width: 100%;"></div>

    <!-- Save Button -->
    <button @click="saveMap">Save Map</button>

    <!-- Download GeoJSON Button -->
    <button @click="downloadGeoJSON">Download GeoJSON</button>

    <!-- Distance Measurement Display -->
    <div v-if="distance">
      <p>Distance: {{ distance }} {{ distanceUnit }}</p>
    </div>

    <!-- Saved Maps List -->
    <div>
      <h3>Saved Maps</h3>
      <ul>
        <li v-for="map in savedMaps" :key="map._id">
          <button @click="loadMap(map._id)">{{ map.filename || 'Unnamed Map' }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import omnivore from 'leaflet-omnivore';
import 'leaflet-geotiff';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-measure'; // Add the leaflet-measure library
import { defineExpose } from 'vue';


// Refs and data initialization
const map = ref(null);
const drawnItems = ref(null);
const savedMaps = ref([]);
const currentMapId = ref(null);
const distance = ref(null); // Track measured distance
const distanceUnit = ref('km'); // Default distance unit

// The uploadedFiles prop will be passed from parent
const props = defineProps({
  uploadedFiles: Array,
});

// Watch for changes in the uploadedFiles prop and load the new file
watch(() => props.uploadedFiles, (newFiles) => {
  if (newFiles.length > 0) {
    const lastFileUrl = newFiles[newFiles.length - 1];
    loadFile(lastFileUrl);
  }
});

// Load the uploaded file to the map
const loadFile = (fileUrl) => {
  drawnItems.value.clearLayers();

  let fileLayer;
  if (fileUrl.endsWith('.geojson')) {
    fileLayer = omnivore.geojson(fileUrl);
  } else if (fileUrl.endsWith('.kml')) {
    fileLayer = omnivore.kml(fileUrl);
  } else if (fileUrl.endsWith('.tiff') || fileUrl.endsWith('.tif')) {
    // Add TIFF file handling using leaflet-geotiff
    fileLayer = L.leafletGeotiff(fileUrl, {
      renderer: L.LeafletGeotiff.plotty(),  // Using the plotty renderer for TIFF files
      band: 0,  // Specify the band to be rendered (if multi-band TIFF)
      noDataValue: -9999,  // Handle missing data values
      clampLow: false,
      clampHigh: false,
    });
  }
  
  if (fileLayer) {
    fileLayer.addTo(drawnItems.value);  // Ensure the file layer is added to drawnItems
  } else {
    console.error('Unsupported file format or failed to load the file.');
  }
};



// On component mount, initialize the map and fetch saved maps
onMounted(() => {
  initializeMap();
  fetchSavedMaps();
});

// Initialize Map and Controls
const initializeMap = () => {
  map.value = L.map('map', { zoomAnimation: false }).setView([51.505, -0.09], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value);

  drawnItems.value = new L.FeatureGroup().addTo(map.value);

  const drawControl = new L.Control.Draw({
    draw: { polyline: true, polygon: true, rectangle: true, marker: true },
    edit: { featureGroup: drawnItems.value },
  });
  map.value.addControl(drawControl);

  map.value.on(L.Draw.Event.CREATED, (event) => {
    const layer = event.layer;
    drawnItems.value.addLayer(layer);
  });

  // Enable distance measurement
  const measureControl = new L.Control.Measure({
    position: 'topright',
    primaryLengthUnit: 'kilometers',
    secondaryLengthUnit: 'miles',
  }).addTo(map.value);

  // Update distance on measurement finish
  map.value.on('measurefinish', (event) => {
    distance.value = event.total;
    distanceUnit.value = event.unit === 'kilometers' ? 'km' : 'miles';
  });
};

// Save drawn shapes as GeoJSON to the server
const saveMap = () => {
  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const geoJSONData = drawnItems.value.toGeoJSON();
  console.log('GeoJSON Data:', geoJSONData);

  if (geoJSONData.features.length > 0) {

    const action = confirm("Do you want to update the existing map? Click 'Cancel' to create a new one.");
    const saveUrl = currentMapId.value
      ? `https://geo-be.onrender.com/api/files/update/${currentMapId.value}` // Update existing map
      : 'https://geo-be.onrender.com/api/files/save'; // Create new map

      const filename = prompt("Enter a filename for the map", "unnamed-map");

    axios.post(saveUrl, { mapData: geoJSONData,filename }, { headers })
      .then((response) => {
        console.log('Map saved successfully:', response.data);
        currentMapId.value = response.data._id; // Update the current map ID
        fetchSavedMaps(); // Refresh saved maps after successful save
      })
      .catch((error) => {
        console.error('Error saving map:', error);
      });
  } else {
    console.error('No shapes to save');
  }
};

// Download drawn shapes as GeoJSON file
const downloadGeoJSON = () => {
  const geoJSONData = drawnItems.value.toGeoJSON();

  if (geoJSONData.features.length > 0) {
    const blob = new Blob([JSON.stringify(geoJSONData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawn_shapes.geojson';
    a.click();
    URL.revokeObjectURL(url);
  } else {
    console.error('No shapes to download');
  }
};


// Fetch saved maps from the server when the component loads
const fetchSavedMaps = () => {
  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}` };

  axios.get('https://geo-be.onrender.com/api/files', { headers })
    .then((response) => {
      savedMaps.value = response.data;
    })
    .catch((error) => {
      console.error('Error fetching saved maps:', error);
    });
};

defineExpose({
  fetchSavedMaps
});

// Load a saved map by ID when the user clicks on it
const loadMap = (fileId) => {
  console.log('Loading file with ID:', fileId);
  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}` };

  axios.get(`https://geo-be.onrender.com/api/files/${fileId}`, { headers })
    .then((response) => {
      const geoJSONData = response.data.geoJSON;
      console.log('Loaded GeoJSON:', geoJSONData);

      currentMapId.value = fileId; // Set the current map ID to the loaded map

      drawnItems.value.clearLayers();

      if (geoJSONData && geoJSONData.type === 'FeatureCollection') {
        const layer = L.geoJSON(geoJSONData, {
          onEachFeature: (feature, layer) => {
            layer.bindPopup(feature.properties ? feature.properties.name : 'No name');
          }
        }).addTo(drawnItems.value);

        map.value.fitBounds(layer.getBounds());
      } else {
        console.error('Invalid GeoJSON format');
      }
    })
    .catch((error) => {
      console.error('Error loading map:', error);
    });
};
</script>

<style scoped>
/* Full height map container */
#map {
  height: 500px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease-in-out;
}

#map:hover {
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
}

/* Buttons Styling */
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 10px 5px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #004494;
}

button:disabled {
  background-color: #c0c0c0;
  cursor: not-allowed;
}

/* Distance Display Styling */
div[distance] {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding: 10px;
  border-radius: 5px;
  background-color: #f8f9fa;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

/* Saved Maps List */
h3 {
  font-size: 24px;
  color: #444;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 8px 0;
}

li button {
  background-color: #28a745;
  font-size: 14px;
  padding: 8px 15px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

li button:hover {
  background-color: #218838;
}

/* General Styling */
body {
  font-family: 'Roboto', sans-serif;
  color: #333;
  line-height: 1.6;
}

div {
  padding: 20px;
}

div h3 {
  margin-top: 30px;
}

div p {
  font-size: 16px;
}
</style>
