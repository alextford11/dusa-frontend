import "./index.css";
import React, {useEffect, useState} from "react";
import {Loader} from "@googlemaps/js-api-loader";
import {Col, Row} from "react-bootstrap";
import {useLocation} from "react-router-dom";
import {v4 as uuid4} from "uuid";
import {handleErrors} from "../Utils";
import TimeRangeToggle from "../TimeRangeToggle";

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
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["maps"]
});
const defaultMapOptions = {
    zoom: 5,
    center: {lat: -27.470441, lng: 153.026032},
    mapTypeId: "terrain",
    mapId: uuid4()
};

interface futureLocation {
    date: Date;
    latitude: number;
    longitude: number;
}

const futureLocations: futureLocation[] = [
    {date: new Date(2024, 0, 28), latitude: -33.86864111615657, longitude: 151.20853918403085},
    {date: new Date(2024, 1, 2), latitude: -28.641970494705618, longitude: 153.61045230186474},
    {date: new Date(2024, 1, 4), latitude: -28.01623797918785, longitude: 153.39919275589466},
    {date: new Date(2024, 1, 5), latitude: -27.47080223046896, longitude: 153.02600821797031},
    {date: new Date(2024, 1, 6), latitude: -26.39596225022934, longitude: 153.08962731263733},
    {date: new Date(2024, 1, 9), latitude: -25.90439590563777, longitude: 153.08958545207108},
    {date: new Date(2024, 1, 10), latitude: -25.2057094630844, longitude: 153.18801484656174},
    {date: new Date(2024, 1, 12), latitude: -25.90439590563777, longitude: 153.08958545207108},
    {date: new Date(2024, 1, 14), latitude: -20.267777428403082, longitude: 148.71551739339378},
    {date: new Date(2024, 1, 15), latitude: -20.256135316459996, longitude: 148.9791439054873},
    {date: new Date(2024, 1, 17), latitude: -20.267777428403082, longitude: 148.71551739339378},
    {date: new Date(2024, 1, 18), latitude: -19.135123886825433, longitude: 146.84111873261747},
    {date: new Date(2024, 1, 21), latitude: -16.921072567966373, longitude: 145.77046078853348},
    {date: new Date(2024, 1, 24), latitude: -37.8135294856578, longitude: 144.96105295793456},
    {date: new Date(2024, 1, 26), latitude: -36.85563089998874, longitude: 174.76353424694122},
    {date: new Date(2024, 1, 28), latitude: -36.890025485478965, longitude: 175.82200928183198},
    {date: new Date(2024, 1, 29), latitude: -38.26057424740252, longitude: 175.10689605643873},
    {date: new Date(2024, 2, 1), latitude: -38.14481298586597, longitude: 176.2377912350575},
    {date: new Date(2024, 2, 2), latitude: -38.690211322248274, longitude: 176.08213450411682},
    {date: new Date(2024, 2, 4), latitude: -41.29235127506859, longitude: 174.77872094550023},
    {date: new Date(2024, 2, 7), latitude: -40.92213663011663, longitude: 172.98734990296236},
    {date: new Date(2024, 2, 8), latitude: -41.75464384656404, longitude: 171.6057875152289},
    {date: new Date(2024, 2, 9), latitude: -42.79500528909684, longitude: 170.9169610187557},
    {date: new Date(2024, 2, 10), latitude: -43.37041454226783, longitude: 170.1767854567045},
    {date: new Date(2024, 2, 12), latitude: -45.02958203338244, longitude: 168.661344229726},
    {date: new Date(2024, 2, 15), latitude: -44.00608520433658, longitude: 170.47984767760295},
    {date: new Date(2024, 2, 16), latitude: -43.53202576436813, longitude: 172.63056850800214},
    {date: new Date(2024, 2, 17), latitude: -33.86864111615657, longitude: 151.20853918403085}
];

const LastUpdated: React.FC = () => {
    const [ukTime, setUkTime] = useState<string>("-");
    const [localTime, setLocalTime] = useState<string>("-");

    const getLastLocation = React.useCallback(async (): Promise<Location | undefined> => {
        try {
            return await fetch(`${import.meta.env.VITE_BACKEND_URL_BASE}/location/recent`).then(
                handleErrors
            );
        } catch (error) {
            console.error("Error fetching recent location:", error);
            return;
        }
    }, []);

    const updateLastLocation = React.useCallback(async () => {
        const lastLocation = await getLastLocation();
        if (lastLocation === undefined) {
            return;
        }

        const response = await fetch(
            `https://maps.googleapis.com/maps/api/timezone/json?location=${lastLocation.latitude},${
                lastLocation.longitude
            }&timestamp=${Math.floor(Date.now() / 1000)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const timezoneDetails = await response.json();

        const currentTime = new Date(lastLocation.created);
        setUkTime(
            currentTime.toLocaleString("en-GB", {
                timeZone: "Europe/London",
                dateStyle: "short",
                timeStyle: "short"
            })
        );
        setLocalTime(
            currentTime.toLocaleString("en-GB", {
                timeZone: timezoneDetails.timeZoneId,
                dateStyle: "short",
                timeStyle: "short"
            })
        );
    }, [getLastLocation]);

    useEffect(() => {
        updateLastLocation();
    }, [updateLastLocation]);

    return (
        <p className="m-0 small text-danger">
            <strong>Last updated</strong> UK: {ukTime} - Local: {localTime}
        </p>
    );
};

interface mapElementProps {
    large?: boolean;
}

const MapElement: React.FC<mapElementProps> = (props) => {
    const windowLocation = useLocation();
    const queryParams = new URLSearchParams(windowLocation.search);
    const timeRange: string = queryParams.get("time_range") || "today";

    const getLocations = React.useCallback(async (): Promise<Location[]> => {
        try {
            const request = await fetch(
                `${import.meta.env.VITE_BACKEND_URL_BASE}/location/list?time_range=${timeRange}`
            ).then(handleErrors);
            const response = await request;
            return response.locations;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
    }, [timeRange]);

    const loadMap = React.useCallback(async () => {
        const {Map, Polyline} = await loader.importLibrary("maps");
        const {AdvancedMarkerElement} = await loader.importLibrary("marker");
        const locations = await getLocations();
        const locationCoordsArray: LocationCoords[] = locations.map((location) => {
            const lat = parseFloat(location.latitude);
            const lng = parseFloat(location.longitude);
            return {lat, lng};
        });

        let mapOptions: object;
        let lastLocation: LocationCoords | null = null;
        if (locationCoordsArray.length) {
            lastLocation = locationCoordsArray[locationCoordsArray.length - 1];
            mapOptions = {
                zoom: 12,
                center: lastLocation,
                mapTypeId: "terrain",
                mapId: uuid4()
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
        if (lastLocation !== undefined) {
            const lastLocationContainer = document.createElement("div");
            lastLocationContainer.className = "map-dot-container";

            const lastLocationDotBorder = document.createElement("div");
            lastLocationDotBorder.className = "map-dot-border";

            const lastLocationDot = document.createElement("div");
            lastLocationDot.className = "map-dot";

            lastLocationDotBorder.appendChild(lastLocationDot);
            lastLocationContainer.appendChild(lastLocationDotBorder);

            new AdvancedMarkerElement({
                map: map,
                position: lastLocation,
                content: lastLocationContainer,
                zIndex: 9999
            });
        }
        futureLocations.forEach((location, index) => {
            if (location.date <= new Date()) {
                return;
            }
            const lastLocationMarker = document.createElement("div");
            lastLocationMarker.className = "map-marker future-location-marker";
            lastLocationMarker.textContent = location.date.toDateString();
            const markerOptions = {
                map: map,
                position: {lat: location.latitude, lng: location.longitude},
                content: lastLocationMarker,
                zIndex: futureLocations.length - index
            };
            new AdvancedMarkerElement(markerOptions);
        });
    }, [getLocations]);

    useEffect(() => {
        loadMap();
    }, [loadMap]);

    return (
        <>
            <Row className="mb-2">
                <Col>
                    <LastUpdated />
                </Col>
                <TimeRangeToggle large={props.large || false} defaultValue={timeRange} />
            </Row>
            <Row className="mb-4">
                <Col className={`map-container ${props.large ? "large" : ""}`}>
                    <div id="map" className="rounded-4">
                        {/* The map will be rendered inside this div */}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default MapElement;
