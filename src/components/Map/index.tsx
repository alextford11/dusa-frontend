import "./index.css";
import React, {useEffect, useState} from "react";
import {handleErrors} from "components/Utils";
import {Loader} from "@googlemaps/js-api-loader";
import {Col, Row, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";

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

const LastUpdated: React.FC = () => {
    const [ukTime, setUkTime] = useState<string>("-");
    const [localTime, setLocalTime] = useState<string>("-");

    const getLastLocation = React.useCallback(async (): Promise<Location> => {
        try {
            return await fetch(`${BACKEND_URL_BASE}/location/recent`).then(handleErrors);
        } catch (error) {
            console.error("Error fetching recent location:", error);
            return;
        }
    }, []);

    const updateLastLocation = React.useCallback(async () => {
        const lastLocation = await getLastLocation();
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/timezone/json?location=${lastLocation.latitude},${
                lastLocation.longitude
            }&timestamp=${Math.floor(Date.now() / 1000)}&key=${GOOGLE_MAPS_API_KEY}`
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

const MapElement: React.FC<mapElementProps> = (props) => {
    const navigate = useNavigate();
    const windowLocation = useLocation();
    const queryParams = new URLSearchParams(windowLocation.search);
    const time_range: string = queryParams.get("time_range") || "today";

    const getLocations = React.useCallback(async (): Promise<Location[]> => {
        try {
            const request = await fetch(
                `${BACKEND_URL_BASE}/location/list?time_range=${time_range}`
            ).then(handleErrors);
            const response = await request;
            return response.locations;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
    }, [time_range]);

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
                let mapOptions, lastLocation;
                if (locationCoordsArray.length) {
                    lastLocation = locationCoordsArray[locationCoordsArray.length - 1];
                    mapOptions = {
                        zoom: 11,
                        center: {lat: lastLocation.lat, lng: lastLocation.lng},
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
    }, [getLocations]);

    const handleTimeRangeButtonOnChange = (buttonValue: string) => {
        navigate({search: `?time_range=${buttonValue}`});
    };

    useEffect(() => {
        loadMap();
    }, [loadMap]);

    return (
        <>
            <Row className="mb-2">
                <Col>
                    <LastUpdated />
                </Col>
                {props.large ? (
                    <Col className="text-end">
                        <ToggleButtonGroup
                            type="radio"
                            name="options"
                            defaultValue={time_range}
                            onChange={handleTimeRangeButtonOnChange}
                        >
                            <ToggleButton id="tbg-radio-1" value="today" size="sm">
                                Today
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-2" value="yesterday" size="sm">
                                Yesterday
                            </ToggleButton>
                            <ToggleButton id="tbg-radio-3" value="all_time" size="sm">
                                All Time
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                ) : null}
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
