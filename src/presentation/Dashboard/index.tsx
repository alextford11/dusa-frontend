import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {handleErrors} from "components/Utils";
import MapElement from "components/Map";
import {Category} from "components/GlobalInterfaces";
import TimeRangeCard from "components/TimeRangeCard";

declare const BACKEND_URL_BASE: string;

interface Stats {
    today: Category[];
    yesterday: Category[];
    all_time: Category[];
}
const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>({today: [], yesterday: [], all_time: []});

    const getStats = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const nsfw = queryParams.get("nsfw") || "false";
        try {
            const response = await fetch(`${BACKEND_URL_BASE}/dashboard?nsfw=${nsfw}`).then(
                handleErrors
            );
            setStats(response.stats);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        getStats();
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <MapElement />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TimeRangeCard
                        timeRangeTitleText="Today"
                        timeRangeLinkDescriptor="today's"
                        categories={stats.today}
                    />
                    <TimeRangeCard
                        timeRangeTitleText="Yesterday"
                        timeRangeLinkDescriptor="yesterday's"
                        categories={stats.yesterday}
                    />
                    <TimeRangeCard
                        timeRangeTitleText="All Time"
                        timeRangeLinkDescriptor="all"
                        categories={stats.all_time}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
