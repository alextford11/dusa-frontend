import React from "react";
import {Button, Card} from "react-bootstrap";
import CategoryAccordion from "components/CategoryAccordion";
import {Category} from "components/GlobalInterfaces";
import {Link} from "react-router-dom";

interface TimeRangeCardProps {
    timeRangeTitleText: string;
    timeRangeLinkDescriptor: string;
    categories: Category[];
    nsfw: string;
    time_range: string;
}

const TimeRangeCard: React.FC<TimeRangeCardProps> = ({
    timeRangeTitleText,
    timeRangeLinkDescriptor,
    categories,
    nsfw,
    time_range
}) => {
    let searchQuery = `?time_range=${time_range}`;
    if (nsfw === "true") {
        searchQuery += `&nsfw=${nsfw}`;
    }

    return (
        <Card className="mb-4">
            <Card.Header>{timeRangeTitleText}</Card.Header>
            <Card.Body>
                {categories.length ? (
                    <CategoryAccordion categories={categories} />
                ) : (
                    <Card.Text>Nothing recorded...</Card.Text>
                )}

                <Link
                    to={{pathname: "/stats", search: searchQuery}}
                    className="d-inline-block me-3"
                >
                    <Button>View {timeRangeLinkDescriptor} stats</Button>
                </Link>
                <Link to={{pathname: "/location", search: searchQuery}} className="d-inline-block">
                    <Button>View {timeRangeLinkDescriptor} locations</Button>
                </Link>
            </Card.Body>
        </Card>
    );
};

export default TimeRangeCard;
