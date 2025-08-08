# BostonCoffeeApp

BostonCoffeeApp is a web application for discovering coffee shops and exploring Boston neighborhoods using geospatial data. It consists of a Node.js/Express API backend and a React-based Single Page Application (SPA) frontend.

## Architecture Overview

- **Backend (API)**: Located in `src/api/`, built with Express.js. Provides RESTful endpoints for geocoding, coffee shop search, and neighborhood queries. Integrates with Azure Maps and a PostgreSQL/PostGIS database.
- **Frontend (SPA)**: Located in `src/spa/`, built with React, TypeScript, Material UI, and OpenLayers. Communicates with the API to display maps, search results, and neighborhood information.
- **Static Assets**: Served from `src/api/static/`, including HTML, CSS, JS bundles, and icons.

## Key Features

- **Geocode Endpoint** (`/api/geocode`): Proxies requests to Azure Maps Geocoding API and returns GeoJSON.
- **Coffee Shop Search** (`/api/coffee/find`): Uses Azure Maps Nearby Search API to find coffee shops near a location.
- **Neighborhood Lookup** (`/api/neighborhoods/find`): Queries a PostGIS-enabled PostgreSQL database for Boston neighborhood boundaries.
- **Interactive Map**: The SPA uses OpenLayers for map rendering, with popups for coffee shop details and neighborhood highlighting.
- **Responsive UI**: Built with Material UI and React functional components.

## Project Structure

```
api/
  app.js              # Express API server
  package.json        # Backend dependencies
  static/             # Static assets (HTML, CSS, JS, icons)
spa/
  app.tsx             # Main React app
  home-page.tsx       # Main map/search page
  components/         # React components (popups, dialogs, results)
  package.json        # Frontend dependencies
  tsconfig.json       # TypeScript config
  webpack.config.js   # Webpack config
```

## Setup & Development

1. **Install dependencies**:
  - Backend: `cd src/api && npm install`
  - Frontend: `cd src/spa && npm install`
  - Or use the VS Code tasks: **NPM Install for API** and **NPM Install for SPA**

2. **Build frontend**:
  - `cd src/spa && npx webpack --mode development`
  - Or use the VS Code task: **NPX Webpack Compile**

3. **Environment Variables**:
  - Create a `.env` file in `src/api/` with:
    - `AZURE_MAPS_KEY=your_azure_maps_key`
    - `DATABASE_URL=your_postgres_connection_string`

4. **Run the API server**:
  - `cd src/api && node app.js`
  - Or use the VS Code launch configuration

5. **Access the app**:

  - Open `http://localhost:3000` in your browser.

## Dependencies

- Node.js, Express, Axios
- PostgreSQL with PostGIS
- React, TypeScript, Webpack, Material UI, OpenLayers
- Azure Maps API

## License

MIT License
