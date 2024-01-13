import React, {FormEvent, useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    Col,
    Form,
    ListGroup,
    Row,
    Toast,
    ToastContainer
} from "react-bootstrap";
import {Category, CategoryItem} from "../GlobalInterfaces";
import {handleErrors} from "../Utils";

interface CategoryItemListItemProps {
    category: Category;
    categoryItem?: CategoryItem;
    updateCategories: () => void;
}

interface CategoryItemListItemFormProps extends CategoryItemListItemProps {
    updateIsEditing: () => void;
}

const CategoryItemListItemForm: React.FC<CategoryItemListItemFormProps> = (props) => {
    const [formData, setFormData] = useState({
        name: ""
    });

    const hasCategoryItem = React.useCallback(() => {
        return props.categoryItem !== undefined;
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

    const handleAddCategoryItem = async (event: FormEvent) => {
        event.preventDefault();

        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL_BASE}/category_item`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...formData, category_id: props.category.id})
            }).then(handleErrors);

            props.updateCategories();
            setFormData({name: ""});
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleUpdateCategoryItem = async (event: FormEvent) => {
        event.preventDefault();
        if (props.categoryItem === undefined) {
            return;
        }

        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL_BASE}/category_item/${props.categoryItem.id}`, {
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
        if (props.categoryItem !== undefined) {
            setFormData({name: props.categoryItem.name});
        }
    }, [hasCategoryItem, props]);

    return (
        <Form onSubmit={hasCategoryItem() ? handleUpdateCategoryItem : handleAddCategoryItem}>
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
                <Col xs="auto">
                    <ButtonGroup>
                        {hasCategoryItem() ? (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={props.updateIsEditing}
                            >
                                Cancel
                            </Button>
                        ) : null}
                        <Button variant="primary" size="sm" type="submit">
                            {hasCategoryItem() ? "Update" : "Add"}
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Form>
    );
};

const CategoryItemListItem: React.FC<CategoryItemListItemProps> = (props) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showCtcToast, setShowCtcToast] = useState<boolean>(false);

    const handleEditCategoryItemClick = () => {
        setIsEditing(true);
    };

    const handleDeleteCategoryItemClick = async () => {
        if (props.categoryItem === undefined) {
            return;
        }

        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL_BASE}/category_item/${props.categoryItem.id}`, {
                method: "DELETE"
            }).then(handleErrors);

            props.updateCategories();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const copyIdToClipboard = () => {
        if (props.categoryItem === undefined) {
            return;
        }

        navigator.clipboard.writeText(props.categoryItem.id);
        setShowCtcToast(true);
    };

    if (isEditing || props.categoryItem === undefined) {
        return (
            <ListGroup.Item>
                <CategoryItemListItemForm
                    category={props.category}
                    categoryItem={props.categoryItem}
                    updateCategories={props.updateCategories}
                    updateIsEditing={() => setIsEditing(false)}
                />
            </ListGroup.Item>
        );
    } else {
        return (
            <ListGroup.Item>
                <Row>
                    <Col>
                        <p className="m-0">{props.categoryItem.name}</p>
                        <a
                            className="small"
                            style={{cursor: "pointer"}}
                            onClick={copyIdToClipboard}
                        >
                            {props.categoryItem.id}
                        </a>
                        <ToastContainer position="middle-center" style={{zIndex: 1}}>
                            <Toast
                                onClose={() => setShowCtcToast(false)}
                                show={showCtcToast}
                                delay={3000}
                                autohide
                            >
                                <Toast.Body>Copied to clipboard!</Toast.Body>
                            </Toast>
                        </ToastContainer>
                    </Col>
                    <Col>
                        <ButtonGroup className="float-end">
                            <Button size="sm" onClick={handleEditCategoryItemClick}>
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteCategoryItemClick}
                            >
                                Delete
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <div className="small"></div>
            </ListGroup.Item>
        );
    }
};

export default CategoryItemListItem;
