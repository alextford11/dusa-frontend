import {Accordion, Col, ListGroup, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Category} from "../../components/GlobalInterfaces";
import {handleErrors} from "../../components/Utils";
import CategoryListItem from "../../components/CategoryListItem";
import CategoryItemListItem from "../../components/CategoryItemListItem";
import PasswordEntry from "../../components/PasswordEntry";
import Cookies from "universal-cookie";

const Backend: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const cookies = new Cookies(null, {path: "/"});

    const getCategories = React.useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_BASE}/category`).then(
                handleErrors
            );
            setCategories(response.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    if (!cookies.get("backendAuthenticated")) {
        return (
            <PasswordEntry
                cookieKey="backendAuthenticated"
                authToken={import.meta.env.VITE_BACKEND_AUTH_TOKEN}
            />
        );
    } else {
        return (
            <>
                <Row className="mb-5">
                    <h1>Alex&#39;s Backend</h1>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Row>
                            <Col>
                                <h2>Categories</h2>
                                <hr />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ListGroup>
                                    {categories.map((category) => (
                                        <CategoryListItem
                                            key={category.id}
                                            category={category}
                                            updateCategories={getCategories}
                                        />
                                    ))}
                                    <CategoryListItem updateCategories={getCategories} />
                                </ListGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <h2>Category Items</h2>
                                <hr />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Accordion>
                                    {categories.map((category) => (
                                        <Accordion.Item key={category.id} eventKey={category.id}>
                                            <Accordion.Header>{category.name}</Accordion.Header>
                                            <Accordion.Body>
                                                <ListGroup>
                                                    {category.category_items.map((categoryItem) => (
                                                        <CategoryItemListItem
                                                            key={categoryItem.id}
                                                            category={category}
                                                            categoryItem={categoryItem}
                                                            updateCategories={getCategories}
                                                        />
                                                    ))}
                                                    <CategoryItemListItem
                                                        category={category}
                                                        updateCategories={getCategories}
                                                    />
                                                </ListGroup>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        );
    }
};

export default Backend;
