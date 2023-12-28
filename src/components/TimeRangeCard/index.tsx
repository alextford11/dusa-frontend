import React from "react";
import {Button, Card} from "react-bootstrap";
import CategoryAccordion from "components/CategoryAccordion";
import {Category} from "components/GlobalInterfaces";
import {Link} from "react-router-dom";

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

                <Link to="location">
                    {/*<Card.Link href="#">*/}
                    <Button>View {timeRangeLinkDescriptor} stats</Button>
                    {/*</Card.Link>*/}
                </Link>
                <Card.Link href="#">
                    <Button>View {timeRangeLinkDescriptor} locations</Button>
                </Card.Link>
            </Card.Body>
        </Card>
    );
};

export default TimeRangeCard;
