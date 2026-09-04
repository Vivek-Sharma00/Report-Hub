export class MapController {
    constructor(containerId) {
        // Define Light and Dark layers
        const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 20, attribution: '&copy; CartoDB' });
        const lightLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' });

        this.map = L.map(containerId, { zoomControl: false, layers: [darkLayer] }).setView([20.5937, 78.9629], 5);
        
        // Add Layer Toggle Control
        const baseMaps = {
            "Dark Mode": darkLayer,
            "Light Mode": lightLayer
        };
        L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(this.map);
        
        this.heatLayer = L.heatLayer([], { radius: 35, blur: 20 }).addTo(this.map);
        this.markers = new Map();
    }

    updateMapData(reports, onMarkerClick) {
        // Clear old markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers.clear();

        const heatPoints = [];

        reports.forEach(report => {
            if (!report.latitude || !report.longitude) return;

            heatPoints.push([report.latitude, report.longitude, Math.min(report.upvotes / 10, 1.0)]);

            const customIcon = L.divIcon({
                className: 'snap-pin',
                html: `<div style="width:38px; height:38px; border-radius:50%; border:3px solid #ff4d4d; background-image:url('${report.photoUrl}'); background-size:cover; background-position:center;"></div>`,
                iconSize: [38, 38], 
                iconAnchor: [19, 19]
            });

            const marker = L.marker([report.latitude, report.longitude], { icon: customIcon })
                .addTo(this.map)
                .on('click', () => onMarkerClick(report));
            
            this.markers.set(report.id, marker);
        });

        this.heatLayer.setLatLngs(heatPoints);
    }

    centerOn(lat, lng, zoom = 14) {
        this.map.setView([lat, lng], zoom);
    }
}