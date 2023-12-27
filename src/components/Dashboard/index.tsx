import React, {useEffect, useState} from "react";
import {Accordion, Badge, Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {handleErrors} from "components/Utils";
import MapComponent from "components/Map";

declare const BACKEND_URL_BASE: string;

interface CategoryItem {
    id: string;
    name: string;
    records_value_sum: string;
}

interface Category {
    id: string;
    name: string;
    category_items: CategoryItem[];
}

interface Stats {
    today: Category[];
    yesterday: Category[];
    all_time: Category[];
}

const CategoryAccordion: React.FC<{categories: Category[]}> = ({categories}) => {
    return (
        <Accordion className="pb-3">
            {categories.map((category) => (
                <Accordion.Item key={category.id} eventKey={category.id}>
                    <Accordion.Header>{category.name}</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            {category.category_items.map((categoryItem) => (
                                <ListGroup.Item
                                    key={categoryItem.id}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    {categoryItem.name}
                                    <Badge bg="primary">{categoryItem.records_value_sum}</Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};

interface TimeRangeCardProps {
    timeRangeTitleText: string;
    timeRangeLinkDescriptor: string;
    categories: Category[];
}

const TimeRangeCard: React.FC<TimeRangeCardProps> = ({
    timeRangeTitleText,
    timeRangeLinkDescriptor,
    categories
}) => {
    return (
        <Card className="mb-4">
            <Card.Header>{timeRangeTitleText}</Card.Header>
            <Card.Body>
                {categories.length ? (
                    <CategoryAccordion categories={categories} />
                ) : (
                    <Card.Text>Nothing recorded...</Card.Text>
                )}

                <Card.Link href="#">
                    <Button>View {timeRangeLinkDescriptor} stats</Button>
                </Card.Link>
                <Card.Link href="#">
                    <Button>View {timeRangeLinkDescriptor} locations</Button>
                </Card.Link>
            </Card.Body>
        </Card>
    );
};

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
                    <MapComponent />
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
