import React, {useEffect, useState} from "react";
import {handleErrors} from "components/Utils";
import {Loader} from "@googlemaps/js-api-loader";

declare const BACKEND_URL_BASE: string;
declare const GOOGLE_MAPS_API_KEY: string;
interface Location {
    id: string;
    created: string;
    latitude: string;
    longitude: string;
}

interface LocationCoords {
    lat: number;
    lng: number;
}

const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["maps"]
});

const MapComponent: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);

    const getLocations = async () => {
        try {
            const response = await fetch(`${BACKEND_URL_BASE}/location/list`).then(handleErrors);
            setLocations(response.locations);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const loadMap = React.useCallback(() => {
        const locationCoordsArray: LocationCoords[] = locations.map((location) => {
            const lat = parseFloat(location.latitude);
            const lng = parseFloat(location.longitude);
            return {lat, lng};
        });
        const recentLocation = locationCoordsArray[locationCoordsArray.length - 1];
        loader
            .importLibrary("maps")
            .then(({Map, Polyline}) => {
                const mapOptions = {
                    zoom: 11,
                    center: {lat: recentLocation.lat, lng: recentLocation.lng},
                    mapTypeId: "terrain"
                };
                const map = new Map(document.getElementById("map"), mapOptions);

                const polylineOptions = {
                    path: locationCoordsArray,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                };
                const polyline = new Polyline(polylineOptions);
                polyline.setMap(map);
            })
            .catch((error) => {
                console.error("Error loading Google Maps:", error);
            });
    }, [locations]);

    useEffect(() => {
        getLocations();
    }, []);

    useEffect(() => {
        loadMap();
    }, [loadMap]);

    if (!locations.length) {
        return <div id="map">Loading...</div>;
    } else {
        return (
            <div id="map" style={{height: "400px", width: "100%"}} className="my-4 rounded-4">
                {/* The map will be rendered inside this div */}
            </div>
        );
    }
};

export default MapComponent;
