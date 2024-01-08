import React, {useEffect, useState} from "react";
import {Card, Col, Row} from "react-bootstrap";
import {handleErrors} from "components/Utils";
import {Category} from "components/GlobalInterfaces";
import {useLocation} from "react-router-dom";
import CategoryAccordion from "components/CategoryAccordion";
import TimeRangeToggle from "components/TimeRangeToggle";

declare const BACKEND_URL_BASE: string;

const StatsList: React.FC = () => {
    const windowLocation = useLocation();
    const queryParams = new URLSearchParams(windowLocation.search);
    const nsfw: string = queryParams.get("nsfw") || "false";
    const time_range: string = queryParams.get("time_range") || "today";
    const [stats, setStats] = useState<Category[]>([]);

    const getStatsTitle = () => {
        if (time_range === "today") {
            return "Today";
        } else if (time_range === "yesterday") {
            return "Yesterday";
        } else {
            return "All Time";
        }
    };

    useEffect(() => {
        const getStats = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL_BASE}/stats/?time_range=${time_range}&nsfw=${nsfw}`
                ).then(handleErrors);
                setStats(response.stats);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        getStats();
    }, [time_range, nsfw]);

    return (
        <>
            <Row className="mb-2">
                <TimeRangeToggle large={true} defaultValue={time_range} />
            </Row>
            <Row>
                <h1>{getStatsTitle()}</h1>
                <hr />
            </Row>
            <Row>
                <Col>
                    {stats.length ? (
                        <CategoryAccordion categories={stats} />
                    ) : (
                        <Card.Text>Nothing recorded...</Card.Text>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default StatsList;
