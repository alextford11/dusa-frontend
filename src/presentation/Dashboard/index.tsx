import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {handleErrors} from "components/Utils";
import MapElement from "components/Map";
import {Category} from "components/GlobalInterfaces";
import TimeRangeCard from "components/TimeRangeCard";
import {useLocation} from "react-router-dom";

declare const BACKEND_URL_BASE: string;

interface Stats {
    today: Category[];
    yesterday: Category[];
    all_time: Category[];
}
const Dashboard: React.FC = () => {
    const windowLocation = useLocation();
    const queryParams = new URLSearchParams(windowLocation.search);
    const nsfw: string = queryParams.get("nsfw") || "false";
    const [stats, setStats] = useState<Stats>({today: [], yesterday: [], all_time: []});

    useEffect(() => {
        const getStats = async () => {
            try {
                const response = await fetch(`${BACKEND_URL_BASE}/dashboard?nsfw=${nsfw}`).then(
                    handleErrors
                );
                setStats(response.stats);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        getStats();
    }, [nsfw]);

    return (
        <Container>
            <MapElement large={false} />
            <Row>
                <Col>
                    <TimeRangeCard
                        timeRangeTitleText="Today"
                        timeRangeLinkDescriptor="today's"
                        categories={stats.today}
                        nsfw={nsfw}
                        time_range="today"
                    />
                    <TimeRangeCard
                        timeRangeTitleText="Yesterday"
                        timeRangeLinkDescriptor="yesterday's"
                        categories={stats.yesterday}
                        nsfw={nsfw}
                        time_range="yesterday"
                    />
                    <TimeRangeCard
                        timeRangeTitleText="All Time"
                        timeRangeLinkDescriptor="all"
                        categories={stats.all_time}
                        nsfw={nsfw}
                        time_range="all_time"
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
