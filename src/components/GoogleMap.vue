<template>
  <div>
    <h2>Geospatial Map</h2>
    <div id="map"></div>
    <!-- File Upload for GeoJSON/KML -->
    <input type="file" @change="handleFileUpload" />
    <!-- Show uploaded datasets -->
    <button @click="toggleDataset">Show/Hide Dataset</button>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
      map: null,
      datasetLayer: null,
      drawingManager: null,
      currentFile: null,
      datasetVisible: true,
    };
  },
  mounted() {
    this.loadGoogleMapsScript();
  },
  methods: {
    loadGoogleMapsScript() {
      if (!window.google || !window.google.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCWH4UiiH9ePFbjlojgg1Wd-bz_8RAt5dQ&libraries=drawing,geometry&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.initMap = () => {
        this.initMap();
      };
      } else {
        this.initMap();
      }
    },
    initMap() {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
          center: { lat: 51.505, lng: -0.09 },
          zoom: 13,
        });

        // Initialize Drawing Manager
        this.initializeDrawingManager();

        // Initialize Data Layer for GeoJSON/KML
        this.datasetLayer = new google.maps.Data();
        this.datasetLayer.setMap(this.map);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const geojsonData = JSON.parse(e.target.result);
          this.addGeoJSONToMap(geojsonData);
        };
        reader.readAsText(file);
      }
    },
    addGeoJSONToMap(geojsonData) {
      this.datasetLayer.addGeoJson(geojsonData);
    },
    toggleDataset() {
      if (this.datasetVisible) {
        this.datasetLayer.setMap(null);
      } else {
        this.datasetLayer.setMap(this.map);
      }
      this.datasetVisible = !this.datasetVisible;
    },
    initializeDrawingManager() {
  if (google && google.maps && google.maps.drawing) {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['marker', 'polygon', 'polyline'],
      },
      markerOptions: {
        draggable: true,
      },
    });
    this.drawingManager.setMap(this.map);
  } else {
    console.error('DrawingManager is not available. Ensure the Google Maps Drawing Library is loaded correctly.');
  }
}

  
  },
};
</script>

<style scoped>
#map {
  height: 500px;
  width: 100%;
  margin-top: 20px;
}
</style>
