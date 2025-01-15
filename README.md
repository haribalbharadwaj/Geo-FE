# GeoSpatial Data Application

This project is a full-stack web application for managing and visualizing geospatial data. Users can upload, edit, and visualize geospatial data in formats like GeoJSON, KML, and TIFF. The application also supports interactive features such as drawing shapes on a map, distance measurement, and point marker management. Built with a backend API and a frontend using Vue.js, this application leverages Mapbox for rendering the map and geospatial data.

User Management and Data Upload:
  1.Users can create accounts and log in.
  2.Users can upload GeoJSON, KML, and TIFF files.
  3.Uploaded files are rendered on a map using Mapbox.
  4.Users can toggle visibility of datasets on the map.
Drawing and Editing Shapes:
  1.Users can draw custom shapes (e.g., polygons, lines) on the map.
  2.Custom shapes can be saved, edited, or deleted later.
Hover Card Information:
  1.Hovering over rendered files or shapes displays a mini card with related information.
Distance Measurement:
  1.Users can measure distances on the map in both kilometers and miles.
Point Marker Management:
  1.Users can add, move (drag and drop), and delete point markers on the map.


# Technology Stack
  Frontend: Vue.js
  Backend: Node.js/Express (or any backend you choose)
  Database: MongoDB (or any database of your choice)
  Geospatial Rendering: Mapbox
  Authentication: JWT (JSON Web Token) for user management

# Prerequisites
  Before starting, make sure you have the following installed:
  Node.js (version 14 or higher)
  MongoDB (if using MongoDB for the backend database)
  Vue CLI (for Vue.js projects)

## Setup Instructions
  1. Backend Setup
  Clone the backend repository:

    bash
    git clone https://github.com/your-username/geo-backend.git
    cd geo-backend
    Install dependencies:

    bash
    npm install
    Configure Environment Variables: Create a .env file in the root directory and configure the following variables:

    MONGODB_URI: Your MongoDB connection string.
    JWT_SECRET: Secret key for JWT authentication.

    makefile
    MONGODB_URI=mongodb://localhost:27017/geoapp
    JWT_SECRET=your_jwt_secret_key_here
    Run the Backend Server:

    bash
    npm run dev
    The backend server should now be running on http://localhost:5000 (or whichever port you specify in your .env file).

  2. Frontend Setup
  Clone the frontend repository:

    bash
    git clone https://github.com/your-username/geo-frontend.git
    cd geo-frontend
    Install dependencies:

    bash
    npm install
    Configure Environment Variables: Create a .env file in the root directory and configure the following variable:
    
    makefile
    Run the Frontend Application:

    bash
    npm run serve
    The frontend should now be running on http://localhost:8080.

  3. API Endpoints
    Here are the key API endpoints for the backend:

    POST /api/users/register: Register a new user.
    POST /api/users/login: Log in an existing user.
    GET /api/users/profile: Get the authenticated user's profile (protected).
    POST /api/files/upload: Upload a GeoJSON, KML, or TIFF file.
    GET /api/files: Fetch all uploaded files.
    DELETE /api/files/:id: Delete an uploaded file.
  4. Frontend Features
    User Authentication: Use the registration and login forms for user management.
    Upload Files: Use the file upload interface to upload GeoJSON, KML, or TIFF files.
    Map Rendering: View uploaded files rendered on a Mapbox map.
    Drawing Shapes: Draw custom shapes on the map using the drawing tool.
    Point Markers: Add, move, or delete point markers on the map.
    Distance Measurement: Use the distance measuring tool to calculate distances on the map.
    Deployment
    For production, you can deploy the frontend and backend on platforms like:

    Frontend: Vercel
    Backend: Render
    Troubleshooting
    CORS Errors: If the frontend cannot communicate with the backend, ensure that CORS is correctly configured in the backend.
    Future Enhancements
    Support for additional geospatial data formats.
    User-specific datasets and personal storage of uploaded files.
    Advanced map layers and styles for data visualization.
    License
    This project is licensed under the MIT License - see the LICENSE file for details

  Deployed Link :https://geo-fe-three.vercel.app/
