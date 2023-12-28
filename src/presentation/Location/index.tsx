import MapElement from "components/Map";
import {Row, Col} from "react-bootstrap";
import React from "react";

const Location: React.FC = () => {
    return (
        <Row>
            <Col>
                <MapElement />
            </Col>
        </Row>
    );
};

export default Location;
