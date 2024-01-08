import {Category} from "components/GlobalInterfaces";
import React, {FormEvent, useEffect, useState} from "react";
import {handleErrors} from "components/Utils";
import {Button, ButtonGroup, Col, Form, ListGroup, Row} from "react-bootstrap";

declare const BACKEND_URL_BASE: string;

interface CategoryListItemProps {
    category?: Category;
    updateCategories: () => void;
}

interface CategoryListItemFormProps extends CategoryListItemProps {
    updateIsEditing: () => void;
}

const CategoryListItemForm: React.FC<CategoryListItemFormProps> = (props) => {
    const [formData, setFormData] = useState({
        name: "",
        nsfw: false
    });

    const hasCategory = React.useCallback(() => {
        return props.category instanceof Object;
    }, [props]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        let value;
        if (name === "nsfw") {
            value = event.target.checked;
        } else {
            value = event.target.value;
        }
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddCategory = async (event: FormEvent) => {
        event.preventDefault();

        try {
            await fetch(`${BACKEND_URL_BASE}/category/`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            }).then(handleErrors);

            props.updateCategories();
            setFormData({name: "", nsfw: false});
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleUpdateCategory = async (event: FormEvent) => {
        event.preventDefault();

        try {
            await fetch(`${BACKEND_URL_BASE}/category/${props.category.id}/`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            }).then(handleErrors);

            props.updateCategories();
            props.updateIsEditing();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        if (hasCategory()) {
            setFormData({name: props.category.name, nsfw: props.category.nsfw});
        }
    }, [hasCategory, props]);

    return (
        <Form onSubmit={hasCategory() ? handleUpdateCategory : handleAddCategory}>
            <Row>
                <Col>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={true}
                    />
                </Col>
                <Col xs="auto" sm="3" className="align-self-center">
                    <Form.Check
                        type="switch"
                        name="nsfw"
                        label="NSFW"
                        checked={formData.nsfw}
                        onChange={handleInputChange}
                    />
                </Col>
                <Col xs="auto">
                    <ButtonGroup>
                        {hasCategory() ? (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={props.updateIsEditing}
                            >
                                Cancel
                            </Button>
                        ) : null}
                        <Button variant="primary" size="sm" type="submit">
                            {hasCategory() ? "Update" : "Add"}
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Form>
    );
};

const CategoryListItem: React.FC<CategoryListItemProps> = (props) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleEditCategoryClick = () => {
        setIsEditing(true);
    };

    const handleDeleteCategoryClick = async (categoryId) => {
        try {
            await fetch(`${BACKEND_URL_BASE}/category/${categoryId}/`, {method: "DELETE"}).then(
                handleErrors
            );

            props.updateCategories();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (isEditing || props.category === undefined) {
        return (
            <ListGroup.Item>
                <CategoryListItemForm
                    category={props.category}
                    updateCategories={props.updateCategories}
                    updateIsEditing={() => setIsEditing(false)}
                />
            </ListGroup.Item>
        );
    } else {
        return (
            <ListGroup.Item>
                {props.category.name}
                <ButtonGroup className="float-end">
                    <Button size="sm" onClick={handleEditCategoryClick}>
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCategoryClick(props.category.id)}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
            </ListGroup.Item>
        );
    }
};

export default CategoryListItem;
