# Report Hub - Live Crowdsourced Mapping Platform

Report Hub is a live, crowdsourced infrastructure reporting tool. It allows authenticated users to pin local hazards (e.g., broken roads, open sewage, electricity outages) directly onto a live map, upload photographic proof, and discuss issues via community comments.

## Architecture & System Design
This application was refactored from a monolithic script into a modern, modular **Service-Oriented Architecture (SOA)** to ensure scalability, maintainability, and clear separation of concerns.

### Tech Stack
* **Frontend UI:** Vanilla JavaScript (ES6 Modules), HTML5, CSS3
* **Map Engine:** Leaflet.js with CartoDB Dark Base and Leaflet.heat
* **Backend Services:** Firebase (Auth, Firestore)
* **Architecture Pattern:** MVC/Service Layer Separation

### Directory Structure
```text
/src
  /config
    firebase-config.js      # Firebase SDK initialization
  /services
    auth-service.js         # Firebase Auth logic isolation
    report-service.js       # Firestore data access & mutations
  /ui
    map-controller.js       # Leaflet map rendering & markers
    ui-controller.js        # DOM manipulation & state updates
  app.js                    # Application orchestrator
index.html                  # Main entry point