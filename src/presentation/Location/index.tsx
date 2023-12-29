import MapElement from "components/Map";
import {Container} from "react-bootstrap";
import React from "react";

const Location: React.FC = () => {
    return (
        <Container>
            <MapElement large={true} />
        </Container>
    );
};

export default Location;
