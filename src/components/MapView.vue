<template>
  <div id="map" style="height: 100%; width: 100%"></div>
</template>

<script>
export default {
  name: "GoogleMap",
  mounted() {
    this.loadGoogleMapsScript();
  },
  methods: {
    loadGoogleMapsScript() {
      if (window.google && window.google.maps) {
        // Google Maps is already loaded, so initialize the map
        this.initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCWH4UiiH9ePFbjlojgg1Wd-bz_8RAt5dQ`;
      script.async = true;
      script.defer = true; // Ensures that script executes after page load

      // Load error handler
      script.onerror = () => {
        console.error('Google Maps API failed to load.');
      };

      script.onload = this.initializeMap; // Initialize map after script is loaded
      document.head.appendChild(script);
    },

    initializeMap() {
      if (window.google && window.google.maps) {
        const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 51.505, lng: -0.09 }, // Coordinates for the map center
          zoom: 13,
        });

        new google.maps.Marker({
          position: { lat: 51.5, lng: -0.09 },
          map: map,
        });
      } else {
        console.error('Google Maps API failed to load or was not accessible.');
      }
    },
  },
};
</script>

<style scoped>
#map {
  height: 500px; /* Adjust the height as needed */
}
</style>
