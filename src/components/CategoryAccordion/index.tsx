import React from "react";
import {Accordion, Badge, ListGroup} from "react-bootstrap";
import {Category} from "../GlobalInterfaces";

interface CategoryAccordionProps {
    categories: Category[];
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({categories}) => {
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

export default CategoryAccordion;
