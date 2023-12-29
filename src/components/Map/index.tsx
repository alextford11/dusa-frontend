import "./index.css";
import React, {useEffect} from "react";
import {handleErrors} from "components/Utils";
import {Loader} from "@googlemaps/js-api-loader";
import {Col, Row} from "react-bootstrap";

declare const BACKEND_URL_BASE: string;
declare const GOOGLE_MAPS_API_KEY: string;

interface mapElementProps {
    large?: boolean;
}
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

const defaultMapOptions = {
    zoom: 5,
    center: {lat: -27.470441, lng: 153.026032},
    mapTypeId: "terrain"
};

const MapElement: React.FC<mapElementProps> = (props) => {
    const getLocations = async (): Promise<Location[]> => {
        try {
            const request = await fetch(`${BACKEND_URL_BASE}/location/list`).then(handleErrors);
            const response = await request;
            return response.locations;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
    };

    const loadMap = React.useCallback(async () => {
        const locations = await getLocations();
        const locationCoordsArray: LocationCoords[] = locations.map((location) => {
            const lat = parseFloat(location.latitude);
            const lng = parseFloat(location.longitude);
            return {lat, lng};
        });

        loader
            .importLibrary("maps")
            .then(({Map, Polyline}) => {
                let mapOptions;
                if (locationCoordsArray.length) {
                    const recentLocation = locationCoordsArray[locationCoordsArray.length - 1];
                    mapOptions = {
                        zoom: 11,
                        center: {lat: recentLocation.lat, lng: recentLocation.lng},
                        mapTypeId: "terrain"
                    };
                } else {
                    mapOptions = defaultMapOptions;
                }
                const map = new Map(document.getElementById("map"), mapOptions);
                if (locationCoordsArray.length) {
                    const polylineOptions = {
                        path: locationCoordsArray,
                        geodesic: true,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    };
                    const polyline = new Polyline(polylineOptions);
                    polyline.setMap(map);
                }
            })
            .catch((error) => {
                console.error("Error loading Google Maps:", error);
            });
    }, []);

    useEffect(() => {
        loadMap();
    }, [loadMap]);

    return (
        <Row>
            <Col className={`map-container my-4 ${props.large ? "large" : ""}`}>
                <div id="map" className="rounded-4">
                    {/* The map will be rendered inside this div */}
                </div>
            </Col>
        </Row>
    );
};

export default MapElement;
